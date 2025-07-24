import sharp from 'sharp';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface OptimizedImageResult {
  buffer: Buffer;
  format: string;
  size: number;
  originalSize: number;
  compressionRatio: number;
}

/**
 * Optimizes an image buffer using Sharp
 * @param imageBuffer - The original image buffer
 * @param options - Optimization options
 * @returns Promise with optimized image result
 */
export async function optimizeImage(
  imageBuffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult> {
  const {
    width = 1200,
    height = 1200,
    quality = 85,
    format = 'jpeg'
  } = options;

  const originalSize = imageBuffer.length;
  
  let sharpInstance = sharp(imageBuffer);
  
  // Get original metadata
  const metadata = await sharpInstance.metadata();
  
  // Only resize if the image is larger than target dimensions
  if (metadata.width && metadata.height) {
    if (metadata.width > width || metadata.height > height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
  }
  
  // Apply format-specific optimizations
  let optimizedBuffer: Buffer;
  
  switch (format) {
    case 'jpeg':
      optimizedBuffer = await sharpInstance
        .jpeg({ 
          quality,
          progressive: true,
          mozjpeg: true
        })
        .toBuffer();
      break;
      
    case 'png':
      optimizedBuffer = await sharpInstance
        .png({ 
          quality,
          compressionLevel: 9,
          adaptiveFiltering: true
        })
        .toBuffer();
      break;
      
    case 'webp':
      optimizedBuffer = await sharpInstance
        .webp({ 
          quality,
          effort: 6
        })
        .toBuffer();
      break;
      
    default:
      optimizedBuffer = await sharpInstance
        .jpeg({ quality })
        .toBuffer();
  }
  
  const optimizedSize = optimizedBuffer.length;
  const compressionRatio = ((originalSize - optimizedSize) / originalSize) * 100;
  
  return {
    buffer: optimizedBuffer,
    format,
    size: optimizedSize,
    originalSize,
    compressionRatio
  };
}

/**
 * Optimizes an image file for web use with predefined settings
 * @param imageBuffer - The original image buffer
 * @returns Promise with optimized image buffer
 */
export async function optimizeProductImage(imageBuffer: Buffer): Promise<Buffer> {
  const result = await optimizeImage(imageBuffer, {
    width: 1200,
    height: 1200,
    quality: 85,
    format: 'jpeg'
  });
  
  console.log(`Image optimized: ${result.originalSize} → ${result.size} bytes (${result.compressionRatio.toFixed(1)}% reduction)`);
  
  return result.buffer;
}

/**
 * Optimizes multiple images concurrently
 * @param imageBuffers - Array of image buffers
 * @param _options - Optimization options (currently unused, preserved for future use)
 * @returns Promise with array of optimized image buffers
 */
export async function optimizeMultipleImages(
  imageBuffers: Buffer[],
  _options: ImageOptimizationOptions = {}
): Promise<Buffer[]> {
  const optimizePromises = imageBuffers.map(buffer => 
    optimizeProductImage(buffer)
  );
  
  return Promise.all(optimizePromises);
}

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
