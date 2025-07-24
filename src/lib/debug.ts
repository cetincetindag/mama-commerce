// Only enable debug in development mode or when explicitly enabled
const isClientDebugEnabled = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
const isServerDebugEnabled = process.env.NODE_ENV === 'development' || process.env.DEBUG_MODE === 'true';

export function sanitizeForLogging(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized = { ...data as Record<string, unknown> };
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization', 'cookie'];
  
  for (const key in sanitized) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      sanitized[key] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

export const debug = {
  log: (...args: unknown[]) => {
    if (isClientDebugEnabled) {
      console.log('[DEBUG]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (isClientDebugEnabled) {
      console.error('[ERROR]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isClientDebugEnabled) {
      console.warn('[WARN]', ...args);
    }
  },
};

export const debugServer = {
  log: (...args: unknown[]) => {
    if (isServerDebugEnabled) {
      console.log('[SERVER DEBUG]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (isServerDebugEnabled) {
      console.error('[SERVER ERROR]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isServerDebugEnabled) {
      console.warn('[SERVER WARN]', ...args);
    }
  },
  apiRequest: (method: string, path: string, data?: unknown) => {
    if (isServerDebugEnabled) {
      console.log(`[API ${method}] ${path}`, data ? sanitizeForLogging(data) : '');
    }
  },
};

// Production-safe logger for critical errors that should always be logged
export const logger = {
  error: (...args: unknown[]) => {
    // In production, you might want to send these to a logging service
    if (process.env.NODE_ENV === 'production') {
      // Only log critical errors in production
      console.error('[CRITICAL]', ...args);
    } else {
      console.error('[ERROR]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[WARN]', ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[INFO]', ...args);
    }
  },
};