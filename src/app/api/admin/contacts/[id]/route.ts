import { type NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { debugServer, sanitizeForLogging } from '@/lib/debug';

const updateContactSchema = z.object({
  status: z.enum(['new', 'read', 'responded', 'closed'])
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const rateLimit = checkRateLimit(ip, 5, 60 * 1000);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { id } = await params;
    const contactId = parseInt(id);
    if (isNaN(contactId)) {
      return NextResponse.json(
        { error: 'Invalid contact ID' },
        { status: 400 }
      );
    }

    const body = await request.json() as unknown;
    debugServer.apiRequest('PATCH', `/api/admin/contacts/${id}`, sanitizeForLogging(body));
    
    const validatedData = updateContactSchema.parse(body);

    const contact = await db.contact.update({
      where: { id: contactId },
      data: { status: validatedData.status }
    });

    debugServer.log(`Contact ${contactId} status updated to: ${validatedData.status}`);
    return NextResponse.json(contact);
  } catch (error) {
    if (error instanceof z.ZodError) {
      debugServer.error('Validation error updating contact:', error.errors);
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    debugServer.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
