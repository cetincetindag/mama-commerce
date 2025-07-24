'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '~/components/layout/MainLayout';
import { useCartContext } from '~/components/cart/CartProvider';
import Image from 'next/image';

interface CustomerInfo {
  ad: string;
  soyad: string;
  telefon: string;
  email: string;
  adres: {
    il: string;
    ilce: string;
    mahalle: string;
    cadde: string;
    binaNo: string;
    daireNo: string;
    postaKodu: string;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    ad: '',
    soyad: '',
    telefon: '',
    email: '',
    adres: {
      il: '',
      ilce: '',
      mahalle: '',
      cadde: '',
      binaNo: '',
      daireNo: '',
      postaKodu: ''
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('adres.')) {
      const addressField = field.split('.')[1];
      if (addressField) {
        setCustomerInfo(prev => ({
          ...prev,
          adres: {
            ...prev.adres,
            [addressField]: value
          }
        }));
      }
    } else {
      setCustomerInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const generateOrderCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const orderCode = generateOrderCode();
      const orderData = {
        orderNumber: orderCode,
        fullName: `${customerInfo.ad} ${customerInfo.soyad}`,
        email: customerInfo.email,
        phone: customerInfo.telefon,
        address: `${customerInfo.adres.mahalle} Mah. ${customerInfo.adres.cadde} Cd. No:${customerInfo.adres.binaNo}/${customerInfo.adres.daireNo}, ${customerInfo.adres.ilce}/${customerInfo.adres.il} ${customerInfo.adres.postaKodu}`,
        items: cart.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.salePrice ?? item.product.price
        })),
        total: cart.total,
        status: 'odeme_bekleniyor'
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Sipariş oluşturulamadı');
      }

      clearCart();
      router.push(`/odeme/basarili?orderCode=${orderCode}&total=${cart.total}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
            <p className="text-gray-600 mb-6">Ödeme yapabilmek için sepetinize ürün eklemeniz gerekiyor.</p>
            <button
              onClick={() => router.push('/urunler')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 border border-blue-600"
            >
              Ürünleri İncele
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sipariş Bilgileri</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ad *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.ad}
                      onChange={(e) => handleInputChange('ad', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Soyad *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.soyad}
                      onChange={(e) => handleInputChange('soyad', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.telefon}
                      onChange={(e) => handleInputChange('telefon', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Teslimat Adresi</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İl *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.adres.il}
                      onChange={(e) => handleInputChange('adres.il', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İlçe *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.adres.ilce}
                      onChange={(e) => handleInputChange('adres.ilce', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mahalle *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.adres.mahalle}
                      onChange={(e) => handleInputChange('adres.mahalle', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cadde/Sokak *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.adres.cadde}
                      onChange={(e) => handleInputChange('adres.cadde', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bina No *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.adres.binaNo}
                      onChange={(e) => handleInputChange('adres.binaNo', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daire No
                    </label>
                    <input
                      type="text"
                      value={customerInfo.adres.daireNo}
                      onChange={(e) => handleInputChange('adres.daireNo', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posta Kodu *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.adres.postaKodu}
                      onChange={(e) => handleInputChange('adres.postaKodu', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 border border-blue-600"
              >
                {isSubmitting ? 'İşleniyor...' : 'Ödemeye Geç'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>
            
            <div className="space-y-4">
              {cart.items.map((item) => {
                const firstImage = item.product.images?.split(',')[0];
                return (
                  <div key={item.id} className="flex items-center">
                    <div className="relative mr-4 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} adet × ₺{(item.product.salePrice ?? item.product.price).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">
                      ₺{((item.product.salePrice ?? item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
              
              <hr className="my-4" />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Toplam:</span>
                <span>₺{cart.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}