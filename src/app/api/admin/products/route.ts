import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { debugServer, sanitizeForLogging } from '@/lib/debug';

const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  materialInfo: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  salePrice: z.number().positive().optional(),
  images: z.string().min(1, 'At least one image is required'),
  type: z.string().min(1, 'Type is required'),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const rateLimit = checkRateLimit(ip, 5, 60 * 1000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json() as unknown;
    debugServer.apiRequest('POST', '/api/admin/products', sanitizeForLogging(body));
    
    const validatedData = createProductSchema.parse(body);

    const product = await db.product.create({
      data: validatedData,
    });

    debugServer.log('Product created successfully:', product.id);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      debugServer.error('Validation error creating product:', error.errors);
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    debugServer.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    debugServer.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}