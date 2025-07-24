'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

interface ProductFormData {
  name: string;
  description: string;
  materialInfo?: string;
  price: number;
  salePrice?: number;
  images: string;
  type: string;
  width?: number;
  height?: number;
}

export default function ProductForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    materialInfo: '',
    price: 0,
    salePrice: undefined,
    images: '',
    type: '',
    width: undefined,
    height: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'salePrice' || name === 'width' || name === 'height'
        ? Number(value) || 0 
        : value,
    }));
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: urls.join(','),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error ?? 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Ürün Adı
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Açıklama
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="materialInfo" className="block text-sm font-medium text-gray-700">
          Malzeme Bilgisi
        </label>
        <textarea
          id="materialInfo"
          name="materialInfo"
          value={formData.materialInfo}
          onChange={handleChange}
          rows={3}
          placeholder="Ürünün malzeme detaylarını buraya yazın..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="width" className="block text-sm font-medium text-gray-700">
            Genişlik (cm) - Opsiyonel
          </label>
          <input
            type="number"
            id="width"
            name="width"
            value={formData.width ?? ''}
            onChange={handleChange}
            min="0"
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700">
            Yükseklik (cm) - Opsiyonel
          </label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height ?? ''}
            onChange={handleChange}
            min="0"
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Fiyat (₺)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
            İndirimli Fiyat (₺) - Opsiyonel
          </label>
          <input
            type="number"
            id="salePrice"
            name="salePrice"
            value={formData.salePrice ?? ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <ImageUpload
        onImagesChange={handleImagesChange}
        initialImages={formData.images ? formData.images.split(',').filter(Boolean) : []}
      />

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Ürün Türü
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Bir tür seçin</option>
          <option value="bel-çantası">Bel Çantası</option>
          <option value="kol-çantası">Kol Çantası</option>
          <option value="omuz-çantası">Omuz Çantası</option>
          <option value="sırt-çantası">Sırt Çantası</option>
          <option value="el-çantası">El Çantası</option>
          <option value="kolye">Kolye</option>
          <option value="bilezik">Bilezik</option>
          <option value="yüzük">Yüzük</option>
          <option value="halhal">Halhal</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Oluşturuluyor...' : 'Ürün Oluştur'}
        </button>
      </div>
    </form>
  );
}