import AdminLayout from '@/components/layout/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';

export default function AddProduct() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Yeni Ürün Ekle</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <ProductForm />
        </div>
      </div>
    </AdminLayout>
  );
}