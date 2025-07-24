'use client';

import { useState } from 'react';
import { useCartContext } from './CartProvider';
import { type Product } from '~/types/product';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, getItemQuantity, updateQuantity } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  const currentQuantity = getItemQuantity(product.id);
  const isInCart = currentQuantity > 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addToCart(product, quantity);
      // Reset quantity to 1 after adding
      setQuantity(1);
    } catch {
      // Handle error silently or show user notification
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const handleUpdateCartQuantity = (newQuantity: number) => {
    if (newQuantity < 0) return;
    updateQuantity(product.id, newQuantity);
  };


  return (
    <div className="space-y-4">
      {isInCart && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
          <span className="text-sm text-green-700 font-medium">
            Sepette: {currentQuantity} adet
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleUpdateCartQuantity(currentQuantity - 1)}
              className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 border border-green-300"
              disabled={currentQuantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="mx-2 min-w-[2rem] text-center font-medium text-green-800">
              {currentQuantity}
            </span>
            <button
              onClick={() => handleUpdateCartQuantity(currentQuantity + 1)}
              className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 border border-green-300"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-center space-x-3 mb-4">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white"
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="mx-3 min-w-[3rem] text-center font-medium text-lg text-gray-900">
          {quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full rounded-lg px-4 py-3 font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2 border border-blue-600"
      >
        <ShoppingCart className="h-5 w-5" />
        <span>
          {isAdding ? 'Ekleniyor...' : `Sepete Ekle`}
        </span>
      </button>
    </div>
  );
}