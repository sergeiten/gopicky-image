"use client";

import React, { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/card";
import { Button } from "@/ui/shadcn/button";
import { Alert, AlertDescription } from "@/ui/shadcn/alert";
import {
  ImageFile,
  ImageUploadResponse,
  ImageActionError,
} from "@/lib/definitions";
import axios from "axios";
import QualitySlider from "./QualitySlider";
import { ImgComparisonSlider } from "@img-comparison-slider/react";
import { formatFileSize } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import Loader from "./Loader";
import Dropzone from "react-dropzone";
import DownloadButton from "./DownloadButton";

const MAX_FILE_SIZE = 10; // Mb

const ImageUploader: React.FC = () => {
  const [quality, setQuality] = useState<number[]>([50]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [response, setResponse] = useState<ImageUploadResponse>();

  const [imageData, setImageData] = useState<ImageFile | null>(null);
  const [error, setError] = useState<ImageActionError>(null);

  const { mutate: uploadImage, isPending } = useMutation({
    mutationKey: ["uploadImage", imageData, quality],
    mutationFn: async () => {
      if (!imageData?.file) {
        return;
      }

      const formData = new FormData();
      formData.append("file", imageData.file);

      return axios
        .post("/api/upload", formData, {
          params: {
            quality: quality[0],
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => response.data);
    },
    onSuccess: (data) => {
      console.log("Upload Successful:", data);
      setResponse(data);
    },
    onError: () => {
      setError({ message: "Failed to upload image" });
    },
  });

  useEffect(() => {
    if (!imageData?.file) {
      return;
    }

    uploadImage();
  }, [imageData, quality, uploadImage]);

  const handleFileUpload = (file?: File) => {
    if (!file) {
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    reset();

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData({
        file,
        preview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      setError({ message: "Please select an image file" });
      return false;
    }

    if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
      setError({ message: `File size should be less than ${MAX_FILE_SIZE}MB` });
      return false;
    }

    return true;
  };

  const reset = () => {
    setImageData(null);
    setError(null);
    setQuality([50]);
    setResponse(undefined);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6 relative">
        <CardHeader>
          <CardTitle className="text-center">Compress IMAGE</CardTitle>
          <CardDescription>
            Compress JPG or PNG with the best quality and compression. Reduce
            the filesize of your image at once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && !response ? <Loader /> : null}
          <Dropzone
            maxFiles={1}
            multiple={false}
            onDrop={(acceptedFiles) => {
              if (acceptedFiles.length === 0) {
                return;
              }

              const file = acceptedFiles?.[0];

              handleFileUpload(file);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div className="space-y-4" {...getRootProps()}>
                <label htmlFor="file">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Upload className="h-12 w-12 text-gray-400" />
                      <div className="text-center">
                        <input
                          {...getInputProps()}
                          id="file"
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.target.files;

                            if (files?.length === 0) {
                              return;
                            }

                            const file = files?.[0];

                            handleFileUpload(file);
                          }}
                        />
                        <Button
                          variant="secondary"
                          className="mr-2"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Select Image
                        </Button>
                        <span className="text-sm text-gray-500">
                          or drag and drop
                        </span>
                        <p className="text-sm text-gray-500 mt-2">
                          PNG, JPG up to {MAX_FILE_SIZE}MB
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            )}
          </Dropzone>
        </CardContent>
      </Card>

      {imageData && response?.fileUrl && (
        <>
          <Card className="mb-6 relative">
            {isPending && <Loader />}
            <CardHeader>
              <CardTitle className="text-center truncate">
                {imageData.file.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <QualitySlider
                  value={quality}
                  onChanged={(value) => {
                    setQuality(value);
                  }}
                  disabled={isPending}
                />
              </div>

              <div className="flex w-full mb-2 flex-col sm:flex-row">
                <div className="flex basis-1/2 justify-center gap-1">
                  <span>Original:</span>
                  <span className="font-semibold">
                    {formatFileSize(imageData.file.size)}
                  </span>
                </div>
                <div className="flex basis-1/2 justify-center gap-1">
                  <span>Compressed:</span>
                  <span className="font-semibold">
                    {formatFileSize(response.compressedSize)} (
                    {response.compressedPercentage}%)
                  </span>
                </div>
              </div>

              <ImgComparisonSlider>
                <img
                  slot="first"
                  src={imageData.preview}
                  alt="Preview"
                  className="rounded object-contain w-full h-auto"
                />
                <img
                  slot="second"
                  src={response.fileUrl}
                  alt="Preview"
                  className="rounded object-contain w-full h-auto"
                />
              </ImgComparisonSlider>
            </CardContent>
          </Card>

          <div className="md:col-span-2 flex justify-center gap-4">
            <Button onClick={reset} variant="outline" disabled={isPending}>
              Clear
            </Button>
            <DownloadButton
              disabled={isPending}
              fileName={imageData.file.name}
              fileUrl={response.fileUrl}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ImageUploader;
