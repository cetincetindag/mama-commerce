import AdminLayout from '~/components/layout/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { db } from '~/server/db';
import ProductActions from '~/components/admin/ProductActions';

export default async function AdminProducts() {
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Ürünler</h1>
          <Link
            href="/admin/products/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ürün Ekle
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Ürün Listesi ({products.length})</h2>
          </div>
          
          {products.length === 0 ? (
            <div className="p-6">
              <p className="text-gray-600">Henüz ürün yok. İlk ürününüzü ekleyerek başlayın.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ürün
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fiyat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tür
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const imageUrls = product.images.split(',').filter(Boolean);
                    return (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              {imageUrls.length > 0 ? (
                                <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                                  <Image
                                    src={imageUrls[0] ?? '/placeholder.jpg'}
                                    alt={product.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">Resim yok</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ₺{product.price.toFixed(2)}
                            {product.salePrice && (
                              <div className="text-sm text-green-600">
                                İndirim: ₺{product.salePrice.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <ProductActions 
                            productId={product.id} 
                            productName={product.name}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}