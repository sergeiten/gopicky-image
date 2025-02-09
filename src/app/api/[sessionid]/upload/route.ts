import { insertUpload } from "@/db/insertUpload";
import { targetPath } from "@/lib/consts";
import { ALLOWED_MIME_TYPES } from "@/lib/definitions";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";

const DEFAULT_QUALITY = 50;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionid: string }> },
) {
  const sessionId = (await params).sessionid;

  if (!sessionId) {
    return new NextResponse(
      JSON.stringify({ message: "No session id specified" }),
      {
        status: 400,
      },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  const searchParams = req.nextUrl.searchParams;

  const quality = validateQuality(searchParams.get("quality"));

  if (!file) {
    return new NextResponse(JSON.stringify({ message: "No file uploaded" }), {
      status: 400,
    });
  }

  if (!Object.values(ALLOWED_MIME_TYPES).includes(file.type)) {
    return new NextResponse(
      JSON.stringify({ message: "File type is not supported" }),
      {
        status: 400,
      },
    );
  }

  try {
    const uploadPath = path.join(targetPath, sessionId);

    fs.mkdirSync(uploadPath, { recursive: true });

    const fileName = `${quality}_${file.name}`;
    const filePath = path.join(uploadPath, fileName);

    if (fs.existsSync(filePath)) {
      const f = fs.statSync(filePath);

      const percentage = calculatePercentage(file.size, f.size);

      return new NextResponse(
        JSON.stringify({
          fileName: fileName,
          compressedSize: f.size,
          compressedPercentage: percentage,
        }),
        { status: 200 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fn = getFunctionName(file.type);

    const output = await sharp(buffer)
      [fn]({ quality: quality })
      .toFile(filePath);

    const percentage = calculatePercentage(file.size, output.size);

    insertUpload({
      sessionId: sessionId,
      fileName: file.name,
      fileExt: fn,
      fileSize: file.size,
      compressedQuality: quality,
      compressedSize: output.size,
    }).catch((e) => {
      console.error("failed to insert upload:", e);
    });

    return new NextResponse(
      JSON.stringify({
        fileName: fileName,
        compressedSize: output.size,
        compressedPercentage: percentage,
      }),
      { status: 200 },
    );
  } catch (e) {
    console.error("failed to store file:", e);

    return new NextResponse(
      JSON.stringify({
        message: "Error uploading file",
      }),
      { status: 500 },
    );
  }
}

function getFunctionName(mime: string): "png" | "jpeg" {
  if (mime === "image/png") {
    return "png";
  }

  return "jpeg";
}

function calculatePercentage(
  originalSize: number,
  compressedSize: number,
): number {
  const sizeDiff = originalSize - compressedSize;
  const percentage = Math.floor((sizeDiff * 100) / compressedSize) * -1;

  return percentage;
}

function validateQuality(quality: string | null): number {
  if (quality) {
    const _quality = parseInt(quality, 10);

    if (_quality <= 0 || _quality > 100) {
      return DEFAULT_QUALITY;
    }

    return _quality;
  }

  return DEFAULT_QUALITY;
}
