import Link from "next/link";
import { notFound } from "next/navigation";
import MainLayout from "~/components/layout/MainLayout";
import { getProductById } from "~/services/productService";
import AddToCartButton from "~/components/cart/AddToCartButton";
import ProductImageGallery from "~/components/products/ProductImageGallery";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const { name, description, materialInfo, price, salePrice, images, type, width, height } = product;
  
  // Split the comma-separated images string into an array of URLs
  const imageUrls = images.split(",").filter(Boolean);
  
  // Format prices
  const formattedPrice = price.toFixed(2);
  const formattedSalePrice = salePrice?.toFixed(2);
  
  // Calculate discount percentage if there's a sale price
  const discountPercentage = salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4 text-sm breadcrumbs">
          <ul className="flex space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-primary-700">
                Ana Sayfa
              </Link>
            </li>
            <li>
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/urunler" className="text-gray-500 hover:text-primary-700">
                Ürünler
              </Link>
            </li>
            <li>
              <span className="mx-2 text-gray-400">/</span>
              <Link 
                href={`/urunler?tip=${type}`} 
                className="text-gray-500 hover:text-primary-700"
              >
                {type === "el-çantası" ? "El Çantaları" :
                  type === "omuz-çantası" ? "Omuz Çantaları" :
                  type === "sırt-çantası" ? "Sırt Çantaları" :
                  type === "cüzdan" ? "Cüzdanlar" :
                  type === "makyaj-çantası" ? "Makyaj Çantaları" : 
                  type}
              </Link>
            </li>
            <li>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">{name}</span>
            </li>
          </ul>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Images */}
          <div>
            <ProductImageGallery
              imageUrls={imageUrls}
              productName={name}
              salePrice={salePrice}
              discountPercentage={discountPercentage}
            />
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{name}</h1>
            
            <div className="mb-4">
              {salePrice ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-primary-700">{formattedSalePrice} ₺</span>
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    {formattedPrice} ₺
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">{formattedPrice} ₺</span>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">{description}</p>
            </div>
            
            {/* Material Information */}
            {materialInfo && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Malzeme Bilgisi</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {materialInfo}
                  </p>
                </div>
              </div>
            )}

            {/* Dimensions */}
            {(width != null || height != null) && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Ölçüler</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex flex-wrap gap-4 text-sm">
                    {width && (
                      <div className="flex items-center">
                        <span className="font-medium text-blue-800">Genişlik:</span>
                        <span className="ml-1 text-blue-700">{width} cm</span>
                      </div>
                    )}
                    {height && (
                      <div className="flex items-center">
                        <span className="font-medium text-blue-800">Yükseklik:</span>
                        <span className="ml-1 text-blue-700">{height} cm</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex items-center">
                <span className="mr-2 font-medium text-gray-700">Kategori:</span>
                <Link
                  href={`/urunler?tip=${type}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {type === "el-çantası" ? "El Çantası" :
                   type === "omuz-çantası" ? "Omuz Çantası" :
                   type === "sırt-çantası" ? "Sırt Çantası" :
                   type === "cüzdan" ? "Cüzdan" :
                   type === "makyaj-çantası" ? "Makyaj Çantası" : 
                   type}
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 