import AdminLayout from '~/components/layout/AdminLayout';
import { db } from '~/server/db';
import OrderManagement from '~/components/admin/OrderManagement';

export default async function AdminOrders() {
  const orders = await db.order.findMany({
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Siparişler</h1>
          <div className="text-sm text-gray-600">
            Toplam {orders.length} sipariş
          </div>
        </div>
        
        <OrderManagement orders={orders} />
      </div>
    </AdminLayout>
  );
}