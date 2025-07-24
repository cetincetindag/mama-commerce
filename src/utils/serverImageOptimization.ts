import sharp from 'sharp';

export interface ServerImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

/**
 * Server-side image optimization for file buffers
 * This function runs on the server and optimizes images
 */
export async function optimizeImageBuffer(
  inputBuffer: Buffer,
  filename: string,
  options: ServerImageOptimizationOptions = {}
): Promise<Buffer> {
  const {
    width = 1200,
    height = 1200,
    quality = 85,
    format = 'jpeg'
  } = options;

  const originalSize = inputBuffer.length;
  
  let sharpInstance = sharp(inputBuffer);
  
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
  
  console.log(`[Image Optimization] ${filename}: ${originalSize} → ${optimizedSize} bytes (${compressionRatio.toFixed(1)}% reduction)`);
  
  return optimizedBuffer;
}

/**
 * Optimizes a product image with predefined settings for the e-commerce site
 */
export async function optimizeProductImageServer(
  inputBuffer: Buffer,
  filename: string
): Promise<Buffer> {
  return optimizeImageBuffer(inputBuffer, filename, {
    width: 1200,
    height: 1200,
    quality: 85,
    format: 'jpeg'
  });
}
