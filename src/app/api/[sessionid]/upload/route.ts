import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";

const DEFAULT_QUALITY = 50;

const targetPath = path.join(process.cwd(), "public/uploads");

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

  // await new Promise((resolve) => setTimeout(resolve, 5000));

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
          message: "File created successfully",
          fileUrl: `/uploads/${sessionId}/${fileName}`,
          compressedSize: f.size,
          compressedPercentage: percentage,
        }),
        { status: 200 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const output = await sharp(buffer)
      .jpeg({ quality: quality })
      .toFile(filePath);

    // fs.writeFileSync(filePath, buffer);

    const percentage = calculatePercentage(file.size, output.size);

    return new NextResponse(
      JSON.stringify({
        message: "File uploaded successfully",
        fileUrl: `/uploads/${sessionId}/${fileName}`,
        compressedSize: output.size,
        compressedPercentage: percentage,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving file:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Error uploading file",
      }),
      { status: 500 },
    );
  }
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
