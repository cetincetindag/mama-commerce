import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { debugServer } from '@/lib/debug';

export async function GET(_request: NextRequest) {
  try {
    // Since middleware already verified the token for admin routes,
    // if we reach this point, the token is valid
    debugServer.log('Token verification successful - middleware passed');
    
    // We can't access the decoded payload here since middleware verified it,
    // but we know it's valid
    return NextResponse.json({ 
      valid: true, 
      message: 'Token is valid' 
    });
  } catch (error) {
    debugServer.error('Token verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}