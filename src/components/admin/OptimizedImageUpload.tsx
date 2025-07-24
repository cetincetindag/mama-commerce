'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface OptimizedImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
}

interface UploadingFile {
  file: File;
  preview: string;
  status: 'pending' | 'optimizing' | 'uploading' | 'completed' | 'error';
  error?: string;
  originalSize?: number;
  optimizedSize?: number;
}

export default function OptimizedImageUpload({ 
  onImagesChange, 
  initialImages = [] 
}: OptimizedImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    // Create uploading file entries
    const newUploadingFiles: UploadingFile[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      originalSize: file.size
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Process each file
    for (const uploadingFile of newUploadingFiles) {
      try {
        // Update status to optimizing
        setUploadingFiles(prev => 
          prev.map(f => 
            f === uploadingFile 
              ? { ...f, status: 'optimizing' as const }
              : f
          )
        );

        // Optimize the image on the server
        const optimizeFormData = new FormData();
        optimizeFormData.append('image', uploadingFile.file);

        const optimizeResponse = await fetch('/api/optimize-image', {
          method: 'POST',
          body: optimizeFormData,
        });

        if (!optimizeResponse.ok) {
          throw new Error('Image optimization failed');
        }

        const optimizedImageBlob = await optimizeResponse.blob();
        const optimizedSize = optimizedImageBlob.size;
        
        // Create optimized file
        const optimizedFile = new File(
          [optimizedImageBlob], 
          uploadingFile.file.name.replace(/\.[^/.]+$/, '.jpg'), // Force .jpg extension
          { type: 'image/jpeg' }
        );

        // Update status to uploading
        setUploadingFiles(prev => 
          prev.map(f => 
            f === uploadingFile 
              ? { ...f, status: 'uploading' as const, optimizedSize }
              : f
          )
        );

        // Upload to UploadThing using the UploadDropzone endpoint
        const uploadFormData = new FormData();
        uploadFormData.append('files', optimizedFile);

        const uploadResponse = await fetch('/api/uploadthing', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Upload to UploadThing failed');
        }

        const uploadResult = await uploadResponse.json() as { data: Array<{ url: string }> };
        
        if (!uploadResult.data || uploadResult.data.length === 0) {
          throw new Error('No URL returned from upload');
        }

        const uploadedUrl = uploadResult.data[0]?.url;
        if (!uploadedUrl) {
          throw new Error('Invalid upload response');
        }

        // Update images list
        setImages(prev => {
          const newImages = [...prev, uploadedUrl];
          onImagesChange(newImages);
          return newImages;
        });

        // Mark as completed
        setUploadingFiles(prev => 
          prev.map(f => 
            f === uploadingFile 
              ? { ...f, status: 'completed' as const }
              : f
          )
        );

        // Remove from uploading list after a delay
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f !== uploadingFile));
        }, 2000);

      } catch (error) {
        console.error('Error processing image:', error);
        
        setUploadingFiles(prev => 
          prev.map(f => 
            f === uploadingFile 
              ? { 
                  ...f, 
                  status: 'error' as const, 
                  error: error instanceof Error ? error.message : 'Unknown error'
                }
              : f
          )
        );
      }
    }

    // Clear the input
    event.target.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Product Images (Optimized)
      </label>
      
      {/* File Input */}
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 4MB (will be optimized)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            multiple 
            accept="image/*"
            onChange={handleFileSelect}
          />
        </label>
      </div>

      {/* Uploading Files Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Processing Images:</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-200">
                <Image
                  src={uploadingFile.preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {uploadingFile.file.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  {uploadingFile.originalSize && (
                    <span>Original: {formatFileSize(uploadingFile.originalSize)}</span>
                  )}
                  {uploadingFile.optimizedSize && (
                    <>
                      <span>→</span>
                      <span>Optimized: {formatFileSize(uploadingFile.optimizedSize)}</span>
                      <span className="text-green-600">
                        (-{(((uploadingFile.originalSize ?? 0) - uploadingFile.optimizedSize) / (uploadingFile.originalSize ?? 1) * 100).toFixed(1)}%)
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-1">
                  {uploadingFile.status === 'pending' && (
                    <span className="text-blue-600">Pending...</span>
                  )}
                  {uploadingFile.status === 'optimizing' && (
                    <span className="text-yellow-600">Optimizing...</span>
                  )}
                  {uploadingFile.status === 'uploading' && (
                    <span className="text-blue-600">Uploading...</span>
                  )}
                  {uploadingFile.status === 'completed' && (
                    <span className="text-green-600">✓ Completed</span>
                  )}
                  {uploadingFile.status === 'error' && (
                    <span className="text-red-600">Error: {uploadingFile.error}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
