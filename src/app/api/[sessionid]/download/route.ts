import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { ALLOWED_MIME_TYPES, DEFAULT_MIME_TYPE } from "@/lib/definitions";

const targetPath = path.join(process.cwd(), "public");

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

  const json = await req.json();

  const { fileName, fileUrl } = json;

  if (!fileUrl) {
    return new NextResponse(
      JSON.stringify({
        message: "Requested image not found",
      }),
      {
        status: 404,
      },
    );
  }

  const filePath = path.join(targetPath, fileUrl);

  if (!fs.existsSync(filePath)) {
    return new NextResponse(
      JSON.stringify({
        message: "Requested image not found",
      }),
      {
        status: 404,
      },
    );
  }

  const fileExtension = filePath.split(".").pop()?.toLowerCase();
  const contentType = getContentType(fileExtension);

  try {
    const buffer = fs.readFileSync(filePath);

    const headers = new Headers();
    headers.append("Content-Disposition", `attachment; filename="${fileName}"`);
    headers.append("Content-Type", contentType);

    return new Response(buffer, {
      headers,
    });
  } catch (error) {
    console.error("Error saving file:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Error download file",
      }),
      { status: 500 },
    );
  }
}

function getContentType(extention?: string): string {
  if (!extention) {
    return DEFAULT_MIME_TYPE;
  }

  if (!Object.keys(ALLOWED_MIME_TYPES).includes(extention)) {
    return DEFAULT_MIME_TYPE;
  }

  return ALLOWED_MIME_TYPES[extention];
}
