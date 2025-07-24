import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { z } from 'zod';
import { debugServer, sanitizeForLogging } from '@/lib/debug';
import { verifyAdminToken, extractTokenFromRequest } from '@/lib/auth';

const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Valid email is required').max(255, 'Email is too long'),
  phone: z.string().min(1, 'Phone is required').max(20, 'Phone is too long'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message is too long')
});

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitInfo(ip: string) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;

  const existing = rateLimitMap.get(ip);
  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  existing.count++;
  if (existing.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequests - existing.count };
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const rateLimit = getRateLimitInfo(ip);

    if (!rateLimit.allowed) {
      debugServer.warn('Rate limit exceeded for IP:', ip);
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = (await request.json()) as unknown;
    debugServer.apiRequest('POST', '/api/iletisim', sanitizeForLogging(body));

    const validatedData = createContactSchema.parse(body);

    const contact = await db.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message,
        status: 'new'
      }
    });

    debugServer.log('Contact form submitted successfully:', contact.id);

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      debugServer.error('Validation error in contact form:', error.errors);
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    debugServer.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyAdminToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const contacts = await db.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });

    debugServer.log('Fetched contacts:', contacts.length);

    return NextResponse.json(contacts);
  } catch (error) {
    debugServer.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}