'use client';

import { useState } from 'react';
import MainLayout from '~/components/layout/MainLayout';
import { Search, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

interface OrderTrackingForm {
  orderNumber: string;
  fullName: string;
}

interface Order {
  id: string;
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: string;
    };
  }[];
}

const statusLabels = {
  'beklemede': 'Beklemede',
  'odeme_bekleniyor': 'Ödeme Bekleniyor',
  'odendi_kargo_bekleniyor': 'Ödendi - Kargo Bekleniyor',
  'kargoya_verildi': 'Kargoya Verildi',
  'teslim_edildi': 'Teslim Edildi',
  'iptal_edildi': 'İptal Edildi'
};

const statusIcons = {
  'beklemede': Clock,
  'odeme_bekleniyor': Clock,
  'odendi_kargo_bekleniyor': Package,
  'kargoya_verildi': Truck,
  'teslim_edildi': CheckCircle,
  'iptal_edildi': XCircle
};

const statusColors = {
  'beklemede': 'text-gray-500',
  'odeme_bekleniyor': 'text-yellow-500',
  'odendi_kargo_bekleniyor': 'text-blue-500',
  'kargoya_verildi': 'text-purple-500',
  'teslim_edildi': 'text-green-500',
  'iptal_edildi': 'text-red-500'
};

export default function OrderTrackingPage() {
  const [formData, setFormData] = useState<OrderTrackingForm>({
    orderNumber: '',
    fullName: ''
  });
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof OrderTrackingForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(`/api/order-tracking?orderNumber=${encodeURIComponent(formData.orderNumber)}&fullName=${encodeURIComponent(formData.fullName)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Sipariş bulunamadı. Lütfen sipariş numaranızı ve ad soyadınızı kontrol ediniz.');
        }
        throw new Error('Sipariş sorgulanırken hata oluştu.');
      }

      const orderData = await response.json() as Order;
      setOrder(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getOrderProgress = (status: string) => {
    const statuses = ['odeme_bekleniyor', 'odendi_kargo_bekleniyor', 'kargoya_verildi', 'teslim_edildi'];
    const currentIndex = statuses.indexOf(status);
    
    if (status === 'iptal_edildi') {
      return -1; // Cancelled
    }
    
    return currentIndex;
  };

  const renderProgressBar = (status: string) => {
    const progress = getOrderProgress(status);
    
    if (progress === -1) {
      return (
        <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
          <XCircle className="h-8 w-8 text-red-500 mr-2" />
          <span className="text-red-700 font-medium">Sipariş İptal Edildi</span>
        </div>
      );
    }

    const steps = [
      { key: 'odeme_bekleniyor', label: 'Ödeme Bekleniyor', icon: Clock },
      { key: 'odendi_kargo_bekleniyor', label: 'Hazırlanıyor', icon: Package },
      { key: 'kargoya_verildi', label: 'Kargoda', icon: Truck },
      { key: 'teslim_edildi', label: 'Teslim Edildi', icon: CheckCircle }
    ];

    return (
      <div className="relative">
        {/* Progress line background */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-300 z-0"></div>
        
        {/* Active progress line */}
        <div 
          className="absolute top-6 left-6 h-0.5 bg-primary-500 z-0 transition-all duration-500"
          style={{ 
            width: progress >= 0 
              ? `calc(${(progress / (steps.length - 1)) * 100}% - 1.5rem + ${(progress / (steps.length - 1)) * 3}rem)` 
              : '0%' 
          }}
        ></div>
        
        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= progress;
            const isCurrent = index === progress;
            
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 bg-white ${
                  isActive 
                    ? 'border-primary-500 text-primary-500' 
                    : 'border-gray-300 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`mt-2 text-xs sm:text-sm font-medium text-center max-w-20 leading-tight ${
                  isActive ? 'text-primary-600' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Sipariş Takip
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Sipariş numaranız ve ad soyadınızla siparişinizin durumunu sorgulayabilirsiniz.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sipariş Numarası *
                </label>
                <input
                  type="text"
                  required
                  value={formData.orderNumber}
                  onChange={(e) => handleInputChange('orderNumber', e.target.value.toUpperCase())}
                  placeholder="Örnek: ABC123"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Siparişte belirtilen ad soyad"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  'Sorgulanıyor...'
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Sipariş Sorgula
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>

          {/* Order Results */}
          {order && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Sipariş #{order.orderNumber}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-600">Toplam Tutar</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">₺{order.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Sipariş Durumu</h3>
                  <div className="px-2">
                    {renderProgressBar(order.status)}
                  </div>
                </div>

                {/* Current Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start sm:items-center">
                    {(() => {
                      const Icon = statusIcons[order.status as keyof typeof statusIcons] || Clock;
                      return <Icon className={`h-6 w-6 mr-3 mt-0.5 sm:mt-0 flex-shrink-0 ${statusColors[order.status as keyof typeof statusColors] || 'text-gray-500'}`} />;
                    })()}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {order.status === 'odeme_bekleniyor' && 'Ödemenizin yapılmasını bekliyoruz.'}
                        {order.status === 'odendi_kargo_bekleniyor' && 'Ödemeniz alındı, siparişiniz hazırlanıyor.'}
                        {order.status === 'kargoya_verildi' && 'Siparişiniz kargo firmasına teslim edildi.'}
                        {order.status === 'teslim_edildi' && 'Siparişiniz başarıyla teslim edildi.'}
                        {order.status === 'iptal_edildi' && 'Siparişiniz iptal edilmiştir.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Sipariş İçeriği</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-b-0">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.product.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {item.quantity} adet × ₺{item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base flex-shrink-0">
                        ₺{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Teslimat Bilgileri</h3>
                <div className="space-y-2 text-sm sm:text-base">
                  <p><strong>Ad Soyad:</strong> {order.fullName}</p>
                  <p><strong>Telefon:</strong> {order.phone}</p>
                  <p><strong>E-posta:</strong> {order.email}</p>
                  <p><strong>Adres:</strong> <span className="break-words">{order.address}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}