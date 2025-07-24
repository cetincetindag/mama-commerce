"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroImageCarouselProps {
  productImages: string[];
}

export default function HeroImageCarousel({ productImages }: HeroImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productImages.length === 0) return;

    // Start with a random image
    setCurrentImageIndex(Math.floor(Math.random() * productImages.length));
    setIsLoading(false);

    // Change image every 4 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        // Get a random index that's different from the current one
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * productImages.length);
        } while (newIndex === prevIndex && productImages.length > 1);
        return newIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [productImages]);

  if (isLoading || productImages.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-200">
        <span className="text-gray-500">Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {productImages.map((imageSrc, index) => (
        <div
          key={`${imageSrc}-${index}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={imageSrc}
            alt="Ürün görseli"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        </div>
      ))}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-100 opacity-20" />
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {productImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Görsel ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
