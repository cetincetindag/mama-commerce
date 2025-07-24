import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { productId, imageUrls } = await request.json() as {
      productId: string;
      imageUrls: string[];
    };

    if (!productId || !Array.isArray(imageUrls)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Update the product with new UploadThing URLs
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { images: imageUrls.join(',') }
    });

    return NextResponse.json({
      success: true,
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        images: updatedProduct.images
      }
    });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
