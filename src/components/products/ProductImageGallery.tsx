"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageGalleryProps {
  imageUrls: string[];
  productName: string;
  salePrice?: number | null;
  discountPercentage: number;
}

export default function ProductImageGallery({
  imageUrls,
  productName,
  salePrice,
  discountPercentage,
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <div>
      {/* Main Image */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
        {imageUrls.length > 0 ? (
          <div className="relative h-full w-full">
            <Image
              src={imageUrls[selectedImageIndex] ?? '/placeholder.jpg'}
              alt={productName}
              fill
              className="object-cover transition-opacity duration-300"
              priority={selectedImageIndex === 0}
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">Resim Yok</span>
          </div>
        )}
        
        {salePrice && (
          <div className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
            %{discountPercentage} İndirim
          </div>
        )}
      </div>
      
      {/* Thumbnail Images */}
      {imageUrls.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {imageUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square overflow-hidden rounded-md border transition-all duration-200 hover:opacity-80 ${
                selectedImageIndex === index
                  ? "border-gray-300 opacity-100 shadow-md"
                  : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-85"
              }`}
            >
              <Image
                src={url}
                alt={`${productName} - Görsel ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
