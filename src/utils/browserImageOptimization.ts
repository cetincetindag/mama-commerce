/**
 * Browser-side image optimization utilities
 * These functions run in the browser before files are uploaded
 */

/**
 * Converts a File object to Buffer for processing
 * @param file - File object from browser
 * @returns Promise with Buffer
 */
export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Converts a Buffer to a File object for upload
 * @param buffer - Image buffer
 * @param filename - Original filename
 * @param mimeType - MIME type of the file
 * @returns File object
 */
export function bufferToFile(buffer: Buffer, filename: string, mimeType = 'image/jpeg'): File {
  const uint8Array = new Uint8Array(buffer);
  const blob = new Blob([uint8Array], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
}

/**
 * Browser-based image optimization using Canvas API
 * This is a fallback for when Sharp is not available (client-side)
 * @param file - Original image file
 * @param maxWidth - Maximum width for the resized image
 * @param maxHeight - Maximum height for the resized image
 * @param quality - JPEG quality (0-1)
 * @returns Promise with optimized File
 */
export async function optimizeImageInBrowser(
  file: File, 
  maxWidth = 1200, 
  maxHeight = 1200, 
  quality = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx!.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          } else {
            reject(new Error('Failed to optimize image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Optimizes multiple images in the browser
 * @param files - Array of image files
 * @param maxWidth - Maximum width for resized images
 * @param maxHeight - Maximum height for resized images
 * @param quality - JPEG quality (0-1)
 * @returns Promise with array of optimized files
 */
export async function optimizeMultipleImagesInBrowser(
  files: File[],
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<File[]> {
  const optimizationPromises = files.map(async (file) => {
    // Only optimize image files
    if (!file.type.startsWith('image/')) {
      return file;
    }
    
    try {
      return await optimizeImageInBrowser(file, maxWidth, maxHeight, quality);
    } catch (error) {
      console.error(`Failed to optimize ${file.name}:`, error);
      return file; // Return original file if optimization fails
    }
  });

  return Promise.all(optimizationPromises);
}
