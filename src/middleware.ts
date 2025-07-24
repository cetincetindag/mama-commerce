import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { debugServer } from './lib/debug';

// Simple JWT verification for Edge Runtime using Web Crypto API
async function verifyJwtEdge(token: string, secret: string): Promise<boolean> {
  try {
    const [header, payload, signature] = token.split('.');
    
    if (!header || !payload || !signature) {
      return false;
    }

    // Recreate the signature to verify
    const data = `${header}.${payload}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(data);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const expectedSignature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const expectedSignatureBase64 = btoa(String.fromCharCode(...new Uint8Array(expectedSignature)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    if (signature !== expectedSignatureBase64) {
      return false;
    }

    // Check payload
    const decodedPayload = JSON.parse(atob(payload)) as { isAdmin?: boolean; exp?: number };
    const now = Math.floor(Date.now() / 1000);
    
    return Boolean(decodedPayload.isAdmin && decodedPayload.exp && decodedPayload.exp > now);
  } catch (error) {
    // Production-safe error logging - only critical errors in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[CRITICAL] Edge JWT verification failed');
    } else {
      debugServer.error('Edge JWT verification failed:', error);
    }
    return false;
  }
}

function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

export async function middleware(request: NextRequest) {
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // For client-side routes, let the page handle authentication
    // The useAdmin hook will handle redirecting if not authenticated
    return NextResponse.next();
  }

  // Check admin API routes (except login)
  if (request.nextUrl.pathname.startsWith('/api/admin') && 
      !request.nextUrl.pathname.startsWith('/api/admin/auth/login')) {
    const token = extractTokenFromRequest(request);
    debugServer.log('Middleware - Request path:', request.nextUrl.pathname);
    debugServer.log('Middleware - Authorization header:', request.headers.get('Authorization'));
    debugServer.log('Middleware - Extracted token:', token ? 'present' : 'missing');
    
    if (!token) {
      debugServer.log('Middleware - No token found, returning 401');
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }
    
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      debugServer.error('Middleware - JWT_SECRET not available');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    const tokenValid = await verifyJwtEdge(token, JWT_SECRET);
    debugServer.log('Middleware - Token valid:', tokenValid ? 'yes' : 'no');
    
    if (!tokenValid) {
      debugServer.log('Middleware - Invalid token, returning 401');
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }
    
    debugServer.log('Middleware - Token verified successfully');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};