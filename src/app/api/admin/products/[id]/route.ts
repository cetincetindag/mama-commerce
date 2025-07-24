import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { debugServer, sanitizeForLogging } from '@/lib/debug';

const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  materialInfo: z.string().optional().nullable(),
  price: z.number().positive('Price must be positive').optional(),
  salePrice: z.number().positive().optional().nullable(),
  images: z.string().min(1, 'At least one image is required').optional(),
  type: z.string().min(1, 'Type is required').optional(),
  width: z.number().positive().optional().nullable(),
  height: z.number().positive().optional().nullable(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const product = await db.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    debugServer.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 
               request.headers.get('x-real-ip') ?? 
               request.headers.get('cf-connecting-ip') ?? 
               'unknown';
    const rateLimit = checkRateLimit(ip, 5, 60 * 1000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { id } = await params;
    const body: unknown = await request.json();
    debugServer.apiRequest('PUT', `/api/admin/products/${id}`, sanitizeForLogging(body));
    
    const validatedData = updateProductSchema.parse(body);

    const product = await db.product.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    debugServer.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 
               request.headers.get('x-real-ip') ?? 
               request.headers.get('cf-connecting-ip') ?? 
               'unknown';
    const rateLimit = checkRateLimit(ip, 5, 60 * 1000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { id } = await params;
    debugServer.apiRequest('DELETE', `/api/admin/products/${id}`);

    await db.product.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    debugServer.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}