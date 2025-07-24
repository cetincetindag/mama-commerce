import AdminLayout from '~/components/layout/AdminLayout';
import { db } from '~/server/db';
import { notFound } from 'next/navigation';
import EditProductForm from '~/components/admin/EditProductForm';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  
  const product = await db.product.findUnique({
    where: { id }
  });

  if (!product) {
    notFound();
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Ürün Düzenle</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <EditProductForm product={product} />
        </div>
      </div>
    </AdminLayout>
  );
}