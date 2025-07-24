import { type Product } from "~/types/product";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  emptyMessage?: string;
};

const ProductGrid = ({ 
  products, 
  emptyMessage = "Hiç ürün bulunamadı." 
}: ProductGridProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <p className="text-center text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid; 