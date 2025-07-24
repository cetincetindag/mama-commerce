import { Suspense } from "react";
import MainLayout from "~/components/layout/MainLayout";
import ProductFilter from "~/components/products/ProductFilter";
import ProductGrid from "~/components/products/ProductGrid";
import { getFilteredProducts, getAllProducts } from "~/services/productService";
import { type ProductFilter as ProductFilterType, type ProductType } from "~/types/product";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Await searchParams in Next.js 15
  const params = await searchParams;
  
  // Parse filter parameters
  const filterParams: ProductFilterType = {};

  // Parse type filter
  const tipParam = params?.tip;
  if (tipParam) {
    const typeParam = typeof tipParam === "string" 
      ? tipParam 
      : tipParam[0];
      
    if (typeParam) {
      // Convert string[] to ProductType[]
      filterParams.type = typeParam.split(",").filter(type => 
        ["bel-çantası", "kol-çantası", "omuz-çantası", "sırt-çantası", "el-çantası", "kolye", "bilezik", "yüzük", "halhal"].includes(type)
      ) as ProductType[];
    }
  }

  // Parse price range
  const minParam = params?.min;
  if (minParam) {
    const minPrice = parseInt(
      typeof minParam === "string" ? minParam : minParam[0] ?? "0"
    );
    if (!isNaN(minPrice)) {
      filterParams.minPrice = minPrice;
    }
  }

  const maxParam = params?.max;
  if (maxParam) {
    const maxPrice = parseInt(
      typeof maxParam === "string" ? maxParam : maxParam[0] ?? "0"
    );
    if (!isNaN(maxPrice)) {
      filterParams.maxPrice = maxPrice;
    }
  }

  // Parse sale filter
  const indirimParam = params?.indirim;
  if (indirimParam === "true") {
    filterParams.onSale = true;
  }

  // Fetch products based on filters
  const products = Object.keys(filterParams).length > 0
    ? await getFilteredProducts(filterParams)
    : await getAllProducts();

  const hasFilters = Object.keys(filterParams).length > 0;
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {hasFilters ? "Filtrelenmiş Ürünler" : "Tüm Ürünler"}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="md:col-span-1">
            <ProductFilter />
          </div>
          
          <div className="md:col-span-3">
            <Suspense fallback={<div>Ürünler yükleniyor...</div>}>
              <ProductGrid 
                products={products} 
                emptyMessage={
                  hasFilters 
                    ? "Filtrelere uygun ürün bulunamadı. Lütfen farklı filtreler deneyin."
                    : "Henüz hiç ürün eklenmemiş."
                }
              />
            </Suspense>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 