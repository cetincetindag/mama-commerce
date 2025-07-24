'use client';

import { useState, useEffect } from 'react';
import { UploadDropzone } from '@/utils/uploadthing';

interface Product {
  id: string;
  name: string;
  localImages: string[];
  uploadedImages: string[];
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

export default function BulkMigrationPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Load products that need migration
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/admin/migration/products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleProductComplete = async (productId: string, newImageUrls: string[]) => {
    try {
      // Update the product in the database
      const response = await fetch('/api/admin/migration/update-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          imageUrls: newImageUrls
        })
      });

      if (response.ok) {
        // Update local state
        setProducts(prev => prev.map(p => 
          p.id === productId 
            ? { ...p, status: 'completed', uploadedImages: newImageUrls }
            : p
        ));
        
        // Move to next product
        const currentIndex = products.findIndex(p => p.id === productId);
        const nextProduct = products[currentIndex + 1];
        setCurrentProduct(nextProduct || null);
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      // Update status to error
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, status: 'error' } : p
      ));
    }
  };

  const startMigration = () => {
    const firstPendingProduct = products.find(p => p.status === 'pending');
    setCurrentProduct(firstPendingProduct || null);
  };

  const skipProduct = () => {
    if (currentProduct) {
      const currentIndex = products.findIndex(p => p.id === currentProduct.id);
      const nextProduct = products[currentIndex + 1];
      setCurrentProduct(nextProduct || null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading migration data...</div>
      </div>
    );
  }

  const completedCount = products.filter(p => p.status === 'completed').length;
  const totalCount = products.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Bulk Image Migration to UploadThing
          </h1>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{completedCount}/{totalCount} products completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {!currentProduct && completedCount < totalCount && (
            <button
              onClick={startMigration}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Start Migration
            </button>
          )}

          {completedCount === totalCount && (
            <div className="text-center py-8">
              <div className="text-green-600 text-xl font-semibold mb-2">
                🎉 Migration Complete!
              </div>
              <p className="text-gray-600">
                All {totalCount} products have been migrated to UploadThing.
              </p>
            </div>
          )}
        </div>

        {/* Current Product Upload */}
        {currentProduct && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Currently Migrating: {currentProduct.name}
            </h2>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Local images to migrate: {currentProduct.localImages.length}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {currentProduct.localImages.map((img, index) => (
                  <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {img.split('/').pop()}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <UploadDropzone
                endpoint="productImageUploader"
                onClientUploadComplete={(res) => {
                  if (res) {
                    const newUrls = res.map((file) => file.url);
                    handleProductComplete(currentProduct.id, newUrls);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error('Upload error:', error);
                  setProducts(prev => prev.map(p => 
                    p.id === currentProduct.id ? { ...p, status: 'error' } : p
                  ));
                }}
                config={{
                  mode: "auto",
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleProductComplete(currentProduct.id, [])}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Skip This Product
              </button>
              <button
                onClick={skipProduct}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Skip to Next
              </button>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Migration Status</h3>
          
          <div className="space-y-2">
            {products.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-600">
                    {product.localImages.length} images
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {product.status === 'completed' && (
                    <span className="text-green-600 text-sm">✓ Completed</span>
                  )}
                  {product.status === 'error' && (
                    <span className="text-red-600 text-sm">✗ Error</span>
                  )}
                  {product.status === 'pending' && (
                    <span className="text-gray-600 text-sm">Pending</span>
                  )}
                  {currentProduct?.id === product.id && (
                    <span className="text-blue-600 text-sm">Current</span>
                  )}
                  
                  <button
                    onClick={() => setCurrentProduct(product)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    disabled={product.status === 'completed'}
                  >
                    {product.status === 'completed' ? 'Done' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
