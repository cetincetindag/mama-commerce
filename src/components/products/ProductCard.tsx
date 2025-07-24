import Image from "next/image";
import Link from "next/link";
import { type Product } from "~/types/product";
import QuickAddToCart from "~/components/cart/QuickAddToCart";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { id, name, price, salePrice, images, width, height, materialInfo } = product;
  
  // Get the first image URL from the comma-separated string
  const firstImage = images.split(",")[0];
  
  // Calculate discount percentage if the product is on sale
  const discountPercentage = salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  return (
    <div className="group h-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md flex flex-col">
      <Link href={`/urunler/${id}`} className="flex-1">
        <div className="relative mb-4 aspect-square overflow-hidden rounded-md">
          <div className="relative h-full w-full">
            {firstImage ? (
              <Image
                src={firstImage}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <span className="text-gray-400">Resim Yok</span>
              </div>
            )}
          </div>
          
          {salePrice && (
            <div className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
              %{discountPercentage} İndirim
            </div>
          )}
        </div>
        
        <h3 className="mb-2 text-lg font-semibold text-gray-800 group-hover:text-primary-700">
          {name}
        </h3>
        
        {/* Dimensions indicator */}
        {(width != null || height != null) && (
          <div className="mb-2 text-xs text-gray-500">
            {width && height ? `${width} × ${height} cm` : 
             width ? `G: ${width} cm` : 
             height ? `Y: ${height} cm` : ''}
          </div>
        )}
        
        {/* Material info preview */}
        {materialInfo && (
          <div className="mb-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded truncate">
            {materialInfo.length > 50 ? `${materialInfo.substring(0, 50)}...` : materialInfo}
          </div>
        )}
        
        <div className="flex items-center mb-3">
          {salePrice ? (
            <>
              <span className="font-bold text-primary-700">{salePrice.toFixed(2)} ₺</span>
              <span className="ml-2 text-sm text-gray-500 line-through">
                {price.toFixed(2)} ₺
              </span>
            </>
          ) : (
            <span className="font-bold text-gray-900">{price.toFixed(2)} ₺</span>
          )}
        </div>
      </Link>
      
      <QuickAddToCart product={product} />
    </div>
  );
};

export default ProductCard; 