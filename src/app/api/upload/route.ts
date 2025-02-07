import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";

const DEFAULT_QUALITY = 50;

const targetPath = path.join(process.cwd(), "public/uploads");

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const params = req.nextUrl.searchParams;

  const quality = validateQuality(params.get("quality"));

  if (!file) {
    return new NextResponse(JSON.stringify({ message: "No file uploaded" }), {
      status: 400,
    });
  }

  // await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    fs.mkdirSync(targetPath, { recursive: true });

    const fileName = `${quality}_${file.name}`;
    const filePath = path.join(targetPath, fileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const output = await sharp(buffer)
      .jpeg({ quality: quality })
      .toFile(filePath);

    // fs.writeFileSync(filePath, buffer);

    const sizeDiff = file.size - output.size;
    const percentage = Math.floor((sizeDiff * 100) / output.size) * -1;

    return new NextResponse(
      JSON.stringify({
        message: "File uploaded successfully",
        fileUrl: `/uploads/${fileName}`,
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
