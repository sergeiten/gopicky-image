import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

type ContentTypeMap = {
  [key: string]: string;
};

const DEFAULT_CONTENT_TYPE = "application/octet-stream";

const contentTypeMap: ContentTypeMap = {
  // svg: "image/svg+xml",
  // ico: "image/x-icon",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  // pdf: "application/pdf",
};

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

  const buffer = fs.readFileSync(filePath);

  const headers = new Headers();
  headers.append("Content-Disposition", `attachment; filename="${fileName}"`);
  headers.append("Content-Type", contentType);

  return new Response(buffer, {
    headers,
  });
}

function getContentType(extention?: string): string {
  if (!extention) {
    return DEFAULT_CONTENT_TYPE;
  }

  if (!Object.keys(contentTypeMap).includes(extention)) {
    return DEFAULT_CONTENT_TYPE;
  }

  return contentTypeMap[extention];
}
