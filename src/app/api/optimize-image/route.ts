import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { optimizeProductImageServer } from '@/utils/serverImageOptimization';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Optimize the image
    const optimizedBuffer = await optimizeProductImageServer(inputBuffer, file.name);

    // Create response with optimized image
    return new NextResponse(optimizedBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': optimizedBuffer.length.toString(),
        'X-Original-Size': inputBuffer.length.toString(),
        'X-Optimized-Size': optimizedBuffer.length.toString(),
        'X-Compression-Ratio': (((inputBuffer.length - optimizedBuffer.length) / inputBuffer.length) * 100).toFixed(1),
      },
    });
  } catch (error) {
    console.error('Error optimizing image:', error);
    return NextResponse.json(
      { error: 'Failed to optimize image' },
      { status: 500 }
    );
  }
}
