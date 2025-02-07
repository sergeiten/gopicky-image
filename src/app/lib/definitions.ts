export interface ImageFile {
  file: File;
  preview: string;
}

export type UploadError = {
  message: string;
} | null;

export interface ImageUploadResponse {
  message: string;
  fileUrl?: string;
  compressedSize: number;
  compressedPercentage: number;
}
