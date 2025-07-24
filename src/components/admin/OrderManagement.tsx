'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import OrderCancellationModal from './OrderCancellationModal';

interface Order {
  id: string;
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  createdAt: Date;
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

interface OrderManagementProps {
  orders: Order[];
}

const statusLabels = {
  'beklemede': 'Beklemede',
  'odeme_bekleniyor': 'Ödeme Bekleniyor',
  'odendi_kargo_bekleniyor': 'Ödendi - Kargo Bekleniyor',
  'kargoya_verildi': 'Kargoya Verildi',
  'teslim_edildi': 'Teslim Edildi',
  'iptal_edildi': 'İptal Edildi'
};

const statusColors = {
  'beklemede': 'bg-gray-100 text-gray-800',
  'odeme_bekleniyor': 'bg-yellow-100 text-yellow-800',
  'odendi_kargo_bekleniyor': 'bg-blue-100 text-blue-800',
  'kargoya_verildi': 'bg-purple-100 text-purple-800',
  'teslim_edildi': 'bg-green-100 text-green-800',
  'iptal_edildi': 'bg-red-100 text-red-800'
};

export default function OrderManagement({ orders }: OrderManagementProps) {
  const router = useRouter();
  const { getAuthHeaders } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancellationModal, setCancellationModal] = useState<{
    isOpen: boolean;
    order: Order | null;
  }>({ isOpen: false, order: null });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    setError(null);
    
    try {
      const authHeaders = getAuthHeaders();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (authHeaders.Authorization) {
        headers.Authorization = authHeaders.Authorization;
      }
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        let errorMessage = 'Sipariş durumu güncellenemedi';
        try {
          const errorData = await response.json() as { error?: string };
          errorMessage = errorData.error ?? errorMessage;
        } catch {
          // If response.json() fails, use default error message
        }
        throw new Error(errorMessage);
      }

      await response.json();
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sipariş durumu güncellenirken bilinmeyen hata oluştu';
      setError(errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleCancelOrder = async (orderId: string, reason: string) => {
    setUpdatingStatus(orderId);
    setError(null);
    
    try {
      const authHeaders = getAuthHeaders();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (authHeaders.Authorization) {
        headers.Authorization = authHeaders.Authorization;
      }
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ 
          status: 'iptal_edildi',
          cancellationReason: reason,
          cancelledBy: 'admin'
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Sipariş iptal edilemedi';
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const result = await response.json();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          errorMessage = result.error ?? errorMessage;
        } catch {
          // Use default error message if JSON parsing fails
        }
        setError(errorMessage);
        return;
      }
      
      // Close the modal
      setCancellationModal({ isOpen: false, order: null });
      
      // Refresh the page to show updated order status
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sipariş iptal edilirken bilinmeyen hata oluştu';
      setError(errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusActions = (order: Order) => {
    const actions = [];
    
    if (order.status === 'odeme_bekleniyor') {
      actions.push(
        <button
          key="confirm-payment"
          onClick={() => updateOrderStatus(order.id, 'odendi_kargo_bekleniyor')}
          disabled={updatingStatus === order.id}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
          title="Ödemeyi Onayla"
        >
          <Package className="h-4 w-4" />
          <span>Ödeme Onaylandı</span>
        </button>
      );
    }
    
    if (order.status === 'odendi_kargo_bekleniyor') {
      actions.push(
        <button
          key="mark-shipped"
          onClick={() => updateOrderStatus(order.id, 'kargoya_verildi')}
          disabled={updatingStatus === order.id}
          className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 disabled:opacity-50"
          title="Kargoya Verildi"
        >
          <Truck className="h-4 w-4" />
          <span>Kargoya Ver</span>
        </button>
      );
    }
    
    if (order.status === 'kargoya_verildi') {
      actions.push(
        <button
          key="mark-delivered"
          onClick={() => updateOrderStatus(order.id, 'teslim_edildi')}
          disabled={updatingStatus === order.id}
          className="flex items-center space-x-1 text-green-600 hover:text-green-800 disabled:opacity-50"
          title="Teslim Edildi"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Teslim Et</span>
        </button>
      );
    }
    
    if (!['teslim_edildi', 'iptal_edildi'].includes(order.status)) {
      actions.push(
        <button
          key="cancel"
          onClick={() => setCancellationModal({ isOpen: true, order })}
          disabled={updatingStatus === order.id}
          className="flex items-center space-x-1 text-red-600 hover:text-red-800 disabled:opacity-50"
          title="Siparişi İptal Et"
        >
          <XCircle className="h-4 w-4" />
          <span>İptal Et</span>
        </button>
      );
    }
    
    return actions;
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {/* Orders Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sipariş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} ürün
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.phone}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₺{order.total.toFixed(2)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Detay</span>
                      </button>
                      
                      {getStatusActions(order)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {orders.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Henüz sipariş bulunmamaktadır.
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Sipariş Detayları - #{selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Müşteri Bilgileri</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Ad Soyad:</strong> {selectedOrder.fullName}</p>
                    <p><strong>E-posta:</strong> {selectedOrder.email}</p>
                    <p><strong>Telefon:</strong> {selectedOrder.phone}</p>
                    <p><strong>Adres:</strong> {selectedOrder.address}</p>
                  </div>
                </div>
                
                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Sipariş Ürünleri</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} adet × ₺{item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium">
                          ₺{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="font-bold">Toplam:</span>
                    <span className="font-bold text-lg">₺{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Status and Date */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Sipariş Durumu</h3>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      statusColors[selectedOrder.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {statusLabels[selectedOrder.status as keyof typeof statusLabels] || selectedOrder.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Order Cancellation Modal */}
      <OrderCancellationModal
        isOpen={cancellationModal.isOpen}
        onClose={() => setCancellationModal({ isOpen: false, order: null })}
        onConfirm={(reason) => {
          if (cancellationModal.order) {
            void handleCancelOrder(cancellationModal.order.id, reason);
          }
        }}
        orderNumber={cancellationModal.order?.orderNumber ?? ''}
        isLoading={updatingStatus === cancellationModal.order?.id}
      />
    </div>
  );
}