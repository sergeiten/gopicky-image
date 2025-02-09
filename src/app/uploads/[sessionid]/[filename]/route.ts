import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { targetPath } from "@/lib/consts";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionid: string; filename: string }> },
) {
  const sessionId = (await params).sessionid;
  const filename = (await params).filename;

  const filePath = path.join(targetPath, sessionId, filename as string);

  try {
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

    const buffer = fs.readFileSync(filePath);

    const headers = new Headers();
    headers.append("Content-Type", "application/octet-stream");

    return new Response(buffer, {
      headers,
    });
  } catch (e) {
    console.log("failed to read uploaded image", e);

    return new NextResponse(
      JSON.stringify({
        message: "Error download file",
      }),
      { status: 500 },
    );
  }
}
