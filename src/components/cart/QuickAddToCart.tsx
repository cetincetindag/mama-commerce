'use client';

import { useState } from 'react';
import { useCartContext } from './CartProvider';
import { type Product } from '~/types/product';
import { ShoppingCart, Check } from 'lucide-react';

interface QuickAddToCartProps {
  product: Product;
}

export default function QuickAddToCart({ product }: QuickAddToCartProps) {
  const { addToCart, getItemQuantity } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  
  const currentQuantity = getItemQuantity(product.id);
  const isInCart = currentQuantity > 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event bubbling
    
    setIsAdding(true);
    try {
      addToCart(product, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000); // Reset after 2 seconds
    } catch {
      // Handle error silently or show user notification
    } finally {
      setIsAdding(false);
    }
  };


  if (justAdded) {
    return (
      <button 
        disabled
        className="w-full rounded-md px-3 py-2 text-sm font-medium text-white bg-green-600 flex items-center justify-center space-x-1"
        onClick={(e) => e.preventDefault()}
      >
        <Check className="h-4 w-4" />
        <span>Eklendi!</span>
      </button>
    );
  }

  if (isInCart) {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full rounded-md px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-1 border border-green-600"
      >
        <ShoppingCart className="h-4 w-4" />
        <span>
          {isAdding ? 'Ekleniyor...' : `Sepette (${currentQuantity})`}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="w-full rounded-md px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-1 border border-blue-600"
    >
      <ShoppingCart className="h-4 w-4" />
      <span>
        {isAdding ? 'Ekleniyor...' : 'Sepete Ekle'}
      </span>
    </button>
  );
}