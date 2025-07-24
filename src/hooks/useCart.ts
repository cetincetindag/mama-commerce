'use client';

import { useState, useEffect } from 'react';
import { type Product } from '~/types/product';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'mama-commerce-cart';

export function useCart() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as { items?: CartItem[] };
        setCart(calculateCartTotals(parsedCart.items ?? []));
      } catch {
        // Ignore errors and start with empty cart
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const calculateCartTotals = (items: CartItem[]): Cart => {
    const total = items.reduce((sum, item) => {
      const price = item.product.salePrice ?? item.product.price;
      return sum + (price * item.quantity);
    }, 0);
    
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    return { items, total, itemCount };
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(currentCart => {
      const existingItem = currentCart.items.find(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = currentCart.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...currentCart.items, {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity
        }];
      }
      
      const newCart = calculateCartTotals(newItems);
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(currentCart => {
      const newItems = currentCart.items.filter(item => item.product.id !== productId);
      return calculateCartTotals(newItems);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(currentCart => {
      const newItems = currentCart.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      return calculateCartTotals(newItems);
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0, itemCount: 0 });
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.items.find(item => item.product.id === productId);
    return item?.quantity ?? 0;
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity
  };
}