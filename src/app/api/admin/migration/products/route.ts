import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all products that have local images
    const products = await prisma.product.findMany();
    
    const productsNeedingMigration = products
      .map(product => {
        const imageUrls = product.images.split(',').filter(url => url.trim());
        const localImages = imageUrls.filter(url => url.startsWith('/uploads/'));
        
        if (localImages.length > 0) {
          return {
            id: product.id,
            name: product.name,
            localImages,
            uploadedImages: [],
            status: 'pending' as const
          };
        }
        return null;
      })
      .filter(Boolean);

    return NextResponse.json({
      products: productsNeedingMigration,
      total: productsNeedingMigration.length
    });
  } catch (error) {
    console.error('Failed to load migration products:', error);
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
