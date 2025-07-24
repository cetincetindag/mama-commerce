'use client';

import AdminLayout from '~/components/layout/AdminLayout';
import Link from 'next/link';
import { Package, Plus, Mail } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

export default function AdminDashboard() {
  const { isAuthenticated, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useAdmin hook will handle redirect
  }
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Yönetim Paneli</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ürünler</h3>
                <p className="text-gray-600">Ürün kataloğunuzu yönetin</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4 space-y-2">
              <Link
                href="/admin/products"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tüm Ürünler
              </Link>
              <Link
                href="/admin/products/add"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ml-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ürün Ekle
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Siparişler</h3>
                <p className="text-gray-600">Siparişleri yönetin ve takip edin</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4 space-y-2">
              <Link
                href="/admin/siparisler"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Tüm Siparişler
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">İletişim Formları</h3>
                <p className="text-gray-600">Müşteri mesajlarını görüntüleyin ve yönetin</p>
              </div>
              <Mail className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="mt-4 space-y-2">
              <Link
                href="/admin/iletisim"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Tüm Mesajlar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}