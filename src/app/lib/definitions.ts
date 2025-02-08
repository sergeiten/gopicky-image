export interface ImageFile {
  file: File;
  preview: string;
}

export type ImageActionError = {
  message: string;
} | null;

export interface ImageUploadResponse {
  message: string;
  fileUrl: string;
  fileId: string;
  compressedSize: number;
  compressedPercentage: number;
}
