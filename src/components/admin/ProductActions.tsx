'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';

interface ProductActionsProps {
  productId: string;
  productName: string;
}

export default function ProductActions({ productId, productName }: ProductActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/admin/products/edit/${productId}`);
  };

  const handleDelete = async () => {
    if (!confirm(`"${productName}" ürününü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Refresh the page to update the product list
      router.refresh();
    } catch {
      alert('Ürün silinemedi');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleEdit}
        className="text-indigo-600 hover:text-indigo-900"
        title="Ürünü düzenle"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-900 disabled:opacity-50"
        title="Ürünü sil"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}