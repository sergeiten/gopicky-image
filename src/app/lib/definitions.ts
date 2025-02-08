export type ImageFile = {
  file: File;
  preview: string;
};

export type ImageActionError = {
  message: string;
} | null;

export type ImageUploadResponse = {
  message: string;
  fileUrl: string;
  fileId: string;
  compressedSize: number;
  compressedPercentage: number;
};

export type MIMETypeMap = {
  [key: string]: string;
};

export const DEFAULT_MIME_TYPE = "application/octet-stream";

export const ALLOWED_MIME_TYPES: MIMETypeMap = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

export type Upload = {
  sessionId: string;
  fileName: string;
  fileExt: string;
  fileSize: number;
  compressedQuality: number;
  compressedSize: number;
};
