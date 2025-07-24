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

    // Start with the first image
    setCurrentImageIndex(0);
    setIsLoading(false);

    // Change image every 5 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % productImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [productImages]);

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % productImages.length
    );
  };

  if (isLoading || productImages.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-200 rounded-xl">
        <span className="text-gray-500">Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl group">
      {productImages.map((imageSrc, index) => (
        <div
          key={`${imageSrc}-${index}`}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={imageSrc}
            alt="Ürün görseli"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority={index === 0}
          />
        </div>
      ))}
      
      {/* Navigation Arrows */}
      {productImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
            aria-label="Önceki görsel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
            aria-label="Sonraki görsel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      
      {/* Progress indicators - subtle and minimal */}
      {productImages.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="flex space-x-1">
            {productImages.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/60 w-1'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
