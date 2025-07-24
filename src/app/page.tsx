import Link from "next/link";
import MainLayout from "~/components/layout/MainLayout";
import ProductCard from "~/components/products/ProductCard";
import HeroImageCarousel from "~/components/layout/HeroImageCarousel";
import { getAllProducts } from "~/services/productService";

export default async function HomePage() {
  const allProducts = await getAllProducts();
  const featuredProducts = allProducts.slice(0, 4);
  
  // Get primary images from all products for the hero carousel
  const heroImages = allProducts
    .map(product => {
      const images = product.images.split(',').map(img => img.trim());
      return images[0]; // Get the first (primary) image
    })
    .filter((img): img is string => Boolean(img)) // Remove any empty/null values and ensure type safety
    .slice(0, 10); // Limit to 10 images for better performance
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="from-primary-50 relative bg-gradient-to-b to-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-5">
            <div className="order-2 lg:order-1 lg:col-span-2">
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
                El Yapımı Özel{" "}
                <span className="text-primary-700">Çantalar</span>
              </h1>
              <p className="mb-6 text-base text-gray-600 lg:text-lg">
                Her biri eşsiz, özenle hazırlanmış el yapımı çantalar ve takılar
                ile tarzınızı tamamlayın.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/urunler"
                  className="bg-primary-600 hover:bg-primary-700 rounded-lg px-5 py-3 text-center font-medium text-white transition-colors"
                >
                  Ürünleri Keşfet
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 lg:col-span-3">
              <div className="relative h-64 overflow-hidden rounded-xl sm:h-80 lg:h-96">
                <HeroImageCarousel productImages={heroImages} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg p-6 text-center shadow-sm">
              <div className="bg-primary-100 text-primary-700 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                El Yapımı Kalite
              </h3>
              <p className="text-gray-600">
                Her çanta, özenle seçilmiş malzemelerle el işçiliği ile
                üretilmektedir.
              </p>
            </div>
            <div className="rounded-lg p-6 text-center shadow-sm">
              <div className="bg-primary-100 text-primary-700 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Benzersiz Tasarımlar
              </h3>
              <p className="text-gray-600">
                Her ürün tamamen benzersizdir ve kendi hikayesini taşır. Özel
                tasarımlarla tarzınızı yansıtın.
              </p>
            </div>
            <div className="rounded-lg p-6 text-center shadow-sm">
              <div className="bg-primary-100 text-primary-700 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Sevgi ile Hazırlanır
              </h3>
              <p className="text-gray-600">
                Her ürünümüz, sevgi ve tutku ile özenle hazırlanmaktadır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">
              Öne Çıkan Ürünler
            </h2>
            <Link
              href="/urunler"
              className="text-primary-600 hover:text-primary-700"
            >
              Tümünü Gör
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.length > 0
              ? featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
              : Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-4 flex aspect-square items-center justify-center rounded-md bg-gray-200">
                    <span className="text-sm text-gray-400">
                      Ürün Ekleyin
                    </span>
                  </div>
                  <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
