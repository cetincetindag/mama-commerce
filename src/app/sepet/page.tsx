'use client';

import Link from "next/link";
import Image from "next/image";
import MainLayout from "~/components/layout/MainLayout";
import { useCartContext } from "~/components/cart/CartProvider";
import { Plus, Minus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCartContext();
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Sepetim</h1>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Cart Items - This would be dynamic in a real app */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900">Sepet Ürünleri</h2>
              </div>
              
              {cart.items.length === 0 ? (
                <div className="p-4">
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mb-4 h-16 w-16 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <h3 className="mb-2 text-lg font-medium text-gray-900">Sepetiniz Boş</h3>
                    <p className="mb-4 text-center text-gray-600">
                      Görünüşe göre henüz sepetinize ürün eklememişsiniz.
                    </p>
                    <Link
                      href="/urunler"
                      className="rounded-lg bg-primary-600 px-5 py-2 text-white hover:bg-primary-700"
                    >
                      Alışverişe Başla
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cart.items.map((item) => {
                    const firstImage = item.product.images.split(",")[0];
                    const currentPrice = item.product.salePrice ?? item.product.price;
                    return (
                      <li key={item.id} className="flex items-center p-4">
                        <div className="relative mr-4 h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          {firstImage ? (
                            <Image
                              src={firstImage}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                              <span className="text-xs text-gray-500">Resim Yok</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between">
                            <h3 className="text-base font-medium text-gray-900">
                              {item.product.name}
                            </h3>
                            <p className="text-base font-medium text-gray-900">
                              {(currentPrice * item.quantity).toFixed(2)} ₺
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Birim Fiyat: {currentPrice.toFixed(2)} ₺
                          </p>
                          <div className="mt-2 flex items-center">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="rounded-md border border-gray-300 bg-white p-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="mx-2 w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="rounded-md border border-gray-300 bg-white p-1 text-gray-600 hover:bg-gray-50"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="ml-auto rounded-md text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          
          <div>
            {/* Order Summary */}
            <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Sipariş Özeti</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="font-medium text-gray-900">{cart.total.toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span className="font-medium text-gray-900">Ücretsiz</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Toplam</span>
                    <span className="font-bold text-gray-900">{cart.total.toFixed(2)} ₺</span>
                  </div>
                </div>
              </div>
              
              {cart.items.length > 0 && (
                <div className="mt-6">
                  <Link
                    href="/odeme"
                    className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white hover:bg-blue-700 border border-blue-600"
                  >
                    Siparişi Tamamla
                  </Link>
                  <Link
                    href="/urunler"
                    className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Alışverişe Devam Et
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 