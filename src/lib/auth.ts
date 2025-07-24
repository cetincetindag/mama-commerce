import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

if (!ADMIN_PASSWORD_HASH) {
  throw new Error('ADMIN_PASSWORD_HASH environment variable is required');
}

// Type-safe access to environment variables after validation
const jwtSecret: string = JWT_SECRET;
const adminPasswordHash: string = ADMIN_PASSWORD_HASH;

export interface AdminPayload {
  isAdmin: true;
  exp: number;
}

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export function generateAdminToken(): string {
  const payload: AdminPayload = {
    isAdmin: true,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
  };
  
  return jwt.sign(payload, jwtSecret, { algorithm: 'HS256' });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] }) as unknown;
    
    // Type guard to check if decoded is AdminPayload
    if (typeof decoded === 'object' && decoded !== null && 
        'isAdmin' in decoded && 'exp' in decoded) {
      
      const possiblePayload = decoded as { isAdmin: unknown; exp: unknown };
      
      if (typeof possiblePayload.isAdmin === 'boolean' &&
          typeof possiblePayload.exp === 'number') {
        
        const adminPayload = possiblePayload as AdminPayload;
        
        if (!adminPayload.isAdmin) {
          return null;
        }
        
        return adminPayload;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, adminPasswordHash);
  } catch {
    return false;
  }
}

export function extractTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}