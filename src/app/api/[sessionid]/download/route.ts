import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { ALLOWED_MIME_TYPES, DEFAULT_MIME_TYPE } from "@/lib/definitions";
import { targetPath } from "@/lib/consts";

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

  const { fileName, attachmentName } = json;

  if (!fileName) {
    return new NextResponse(
      JSON.stringify({
        message: "Requested image not found",
      }),
      {
        status: 404,
      },
    );
  }

  const filePath = path.join(targetPath, sessionId, fileName);

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
    headers.append(
      "Content-Disposition",
      `attachment; filename="${attachmentName}"`,
    );
    headers.append("Content-Type", contentType);

    return new Response(buffer, {
      headers,
    });
  } catch (e) {
    console.error("failed to download file:", e);

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
