import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { generateAdminToken, verifyAdminPassword, loginSchema } from '@/lib/auth';
import { debugServer, sanitizeForLogging } from '@/lib/debug';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

if (!ADMIN_USERNAME) {
  throw new Error('ADMIN_USERNAME environment variable is required');
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 
               request.headers.get('x-real-ip') ?? 
               request.headers.get('cf-connecting-ip') ?? 
               'unknown';
    
    const rateLimit = checkRateLimit(ip, 5, 60 * 1000);
    if (!rateLimit.allowed) {
      debugServer.warn('Rate limit exceeded for IP:', ip);
      return NextResponse.json(
        { error: 'Çok fazla istek' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
          }
        }
      );
    }

    const body: unknown = await request.json();
    debugServer.apiRequest('POST', '/api/admin/auth/login', sanitizeForLogging(body));
    
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      debugServer.warn('Invalid login data:', validation.error.errors);
      return NextResponse.json(
        { error: 'Geçersiz istek verisi' },
        { status: 400 }
      );
    }
    
    const { username, password } = validation.data;

    if (username !== ADMIN_USERNAME) {
      debugServer.warn('Invalid username attempt:', username);
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı bilgileri' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyAdminPassword(password);
    if (!isValidPassword) {
      debugServer.warn('Invalid password attempt for admin');
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı bilgileri' },
        { status: 401 }
      );
    }

    const token = generateAdminToken();
    
    return NextResponse.json(
      { 
        success: true,
        token 
      },
      {
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
        }
      }
    );
  } catch (error) {
    debugServer.error('Login error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    debugServer.log('Admin logout requested');
    return NextResponse.json({ success: true });
  } catch (error) {
    debugServer.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}