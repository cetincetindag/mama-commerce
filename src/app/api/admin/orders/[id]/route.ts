import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { debugServer, sanitizeForLogging } from '@/lib/debug';
import { sendOrderCancellationEmail } from '@/services/emailService';

const updateOrderSchema = z.object({
  status: z.enum(['beklemede', 'odeme_bekleniyor', 'odendi_kargo_bekleniyor', 'kargoya_verildi', 'teslim_edildi', 'iptal_edildi']),
  cancellationReason: z.string().optional(),
  cancelledBy: z.string().optional()
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const rateLimit = checkRateLimit(ip, 5, 60 * 1000);
    
    if (!rateLimit.allowed) {
      debugServer.error('Rate limit exceeded for order update');
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { id } = await params;
    const body = await request.json() as { status: string; cancellationReason?: string; cancelledBy?: string };
    debugServer.apiRequest('PUT', `/api/admin/orders/${id}`, sanitizeForLogging(body));
    
    const { status, cancellationReason, cancelledBy } = updateOrderSchema.parse(body);
    debugServer.log(`Updating order ${id} to status: ${status}`);

    // Prepare update data
    const updateData: {
      status: string;
      cancellationReason?: string;
      cancelledAt?: Date;
      cancelledBy?: string;
    } = { status };
    
    // If order is being cancelled, add cancellation details
    if (status === 'iptal_edildi') {
      updateData.cancellationReason = cancellationReason;
      updateData.cancelledAt = new Date();
      updateData.cancelledBy = cancelledBy ?? 'admin';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const order = await (db as any).order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    debugServer.log(`Order ${id} updated successfully to status: ${status}`);
    
    // Send email notification if order is cancelled
    if (status === 'iptal_edildi') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await sendOrderCancellationEmail(order);
    }
    
    // Here you could add other email notification logic
    // sendOrderStatusEmail(order.email, order.orderNumber, status);

    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      debugServer.error('Validation error updating order:', error.errors);
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    debugServer.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const order = await (db as any).order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    debugServer.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}