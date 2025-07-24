'use client';

import Link from "next/link";
import Image from "next/image";
import { useCartContext } from "~/components/cart/CartProvider";

const Navbar = () => {
  const { cart } = useCartContext();
  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image 
            src="/lavantalogo.png" 
            alt="Lavanta Tasarım" 
            width={300} 
            height={100}
            className="h-14 w-auto"
          />
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            href="/urunler"
            className="hover:text-primary-700 text-gray-600"
          >
            Ürünler
          </Link>
          <Link
            href="/iletisim"
            className="hover:text-primary-700 text-gray-600"
          >
            İletişim
          </Link>
          <Link
            href="/sepet"
            className="hover:text-primary-700 flex items-center text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 h-5 w-5"
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
            <span>Sepetim</span>
            {cart.itemCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                {cart.itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
