import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const fullName = searchParams.get('fullName');

    if (!orderNumber || !fullName) {
      return NextResponse.json(
        { error: 'Sipariş numarası ve ad soyad gereklidir' },
        { status: 400 }
      );
    }

    const order = await db.order.findFirst({
      where: {
        orderNumber: orderNumber.toUpperCase(),
        fullName: fullName
      },
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
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}