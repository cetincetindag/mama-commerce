'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { debug } from '@/lib/debug';

export function useAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    
    if (!token) {
      debug.log('No admin token found, redirecting to login');
      router.push('/admin/login');
      return;
    }

    // Simply decode the token client-side instead of making an API call
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3 || !tokenParts[1]) {
        throw new Error('Invalid token format');
      }
      
      const payload: unknown = JSON.parse(atob(tokenParts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (payload && typeof payload === 'object' && 
          'exp' in payload && 'isAdmin' in payload &&
          typeof payload.exp === 'number' && payload.exp > now && 
          payload.isAdmin === true) {
        setIsAuthenticated(true);
        debug.log('Admin authentication verified');
      } else {
        debug.warn('Admin token expired or invalid');
        localStorage.removeItem('admin-token');
        router.push('/admin/login');
      }
    } catch (error) {
      debug.error('Token decode error:', error);
      localStorage.removeItem('admin-token');
      router.push('/admin/login');
    }
    
    setIsLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('admin-token');
    debug.log('Admin logged out');
    router.push('/admin/login');
  };

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('admin-token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }, []);

  return {
    isAuthenticated,
    isLoading,
    logout,
    getAuthHeaders,
  };
}