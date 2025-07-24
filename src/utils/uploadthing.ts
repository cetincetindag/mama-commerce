import React from "react";
import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { optimizeMultipleImagesInBrowser } from "./browserImageOptimization";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

interface OptimizedUploadDropzoneProps {
  endpoint: keyof OurFileRouter;
  onClientUploadComplete?: (files: unknown[]) => void;
  onUploadError?: (error: Error) => void;
  [key: string]: unknown;
}

/**
 * Custom UploadDropzone with built-in image optimization
 */
export function OptimizedUploadDropzone(props: OptimizedUploadDropzoneProps) {
  const handleBeforeUploadBegin = async (files: File[]) => {
    console.log(`Optimizing ${files.length} images before upload...`);
    
    const optimizedFiles = await optimizeMultipleImagesInBrowser(files);

    console.log('Image optimization complete!');
    return optimizedFiles;
  };

  return React.createElement(UploadDropzone, {
    ...props,
    onBeforeUploadBegin: handleBeforeUploadBegin,
  });
}
