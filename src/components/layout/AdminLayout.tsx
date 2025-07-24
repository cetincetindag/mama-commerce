'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ShoppingCart, Settings, LogOut, Mail } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/login', { method: 'DELETE' });
      router.push('/admin/login');
    } catch {
      // Logout attempt failed, redirect anyway
      router.push('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-800">Yönetim Paneli</h1>
          </div>
          <nav className="mt-8">
            <Link
              href="/admin"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Package className="mr-3 h-5 w-5" />
              Ana Sayfa
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Package className="mr-3 h-5 w-5" />
              Ürünler
            </Link>
            <Link
              href="/admin/siparisler"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <ShoppingCart className="mr-3 h-5 w-5" />
              Siparişler
            </Link>
            <Link
              href="/admin/iletisim"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Mail className="mr-3 h-5 w-5" />
              İletişim Formları
            </Link>
            <Link
              href="/"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Settings className="mr-3 h-5 w-5" />
              Mağazaya Dön
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Çıkış Yap
            </button>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}