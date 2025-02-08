import sql from "@/lib/db";
import { Upload } from "@/lib/definitions";

/* 
TODO: check why dynamic insert is not working

Error: UNDEFINED_VALUE: Undefined values are not allowed

const columns = [
  "session_id",
  "file_name",
  "file_ext",
  "file_size",
  "compressed_quality",
  "compressed_size",
];

await sql`
  insert into uploads ${
    sql(upload, columns)
  }
`
*/

export async function insertUpload(upload: Upload) {
  const inserted = await sql`
    insert into uploads (session_id, file_name, file_ext, file_size, compressed_quality, compressed_size) 
    values ( ${upload.sessionId}, ${upload.fileName}, ${upload.fileExt}, ${upload.fileSize}, ${upload.compressedQuality}, ${upload.compressedSize} ) 
    returning *
  `;

  return inserted[0];
}
