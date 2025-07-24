"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const productTypes = [
  { id: "bel-çantası", label: "Bel Çantası" },
  { id: "kol-çantası", label: "Kol Çantası" },
  { id: "omuz-çantası", label: "Omuz Çantası" },
  { id: "sırt-çantası", label: "Sırt Çantası" },
  { id: "el-çantası", label: "El Çantası" },
  { id: "kolye", label: "Kolye" },
  { id: "bilezik", label: "Bilezik" },
  { id: "yüzük", label: "Yüzük" },
  { id: "halhal", label: "Halhal" },
];

const ProductFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse current query parameters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [onSale, setOnSale] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Initialize filter state from URL parameters
  useEffect(() => {
    const typeParam = searchParams.get("tip");
    const minPriceParam = searchParams.get("min");
    const maxPriceParam = searchParams.get("max");
    const onSaleParam = searchParams.get("indirim");
    
    if (typeParam) {
      setSelectedTypes(typeParam.split(","));
    }
    
    if (minPriceParam) {
      setMinPrice(minPriceParam);
    }
    
    if (maxPriceParam) {
      setMaxPrice(maxPriceParam);
    }
    
    if (onSaleParam === "true") {
      setOnSale(true);
    }
  }, [searchParams]);
  
  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (selectedTypes.length > 0) {
      params.set("tip", selectedTypes.join(","));
    }
    
    if (minPrice) {
      params.set("min", minPrice);
    }
    
    if (maxPrice) {
      params.set("max", maxPrice);
    }
    
    if (onSale) {
      params.set("indirim", "true");
    }
    
    router.push(`/urunler?${params.toString()}`);
  };
  
  // Handle type selection
  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes((prev) => 
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedTypes([]);
    setMinPrice("");
    setMaxPrice("");
    setOnSale(false);
    router.push("/urunler");
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Mobile Toggle Button */}
      <div className="block md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
          aria-expanded={isExpanded}
        >
          <h2 className="text-lg font-bold text-gray-900">Filtreler</h2>
          <svg
            className={`h-5 w-5 transform transition-transform ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block p-4 pb-0">
        <h2 className="text-lg font-bold text-gray-900">Filtreler</h2>
      </div>

      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block p-4`}>
        <div className="mb-6">
          <h3 className="mb-2 font-medium text-gray-700">Ürün Tipi</h3>
          <div className="space-y-2">
            {productTypes.map((type) => (
              <label key={type.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => handleTypeToggle(type.id)}
                />
                <span className="ml-2 text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="mb-2 font-medium text-gray-700">Fiyat Aralığı</h3>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <input
                type="number"
                placeholder="Min ₺"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
              />
            </div>
            <div className="w-1/2">
              <input
                type="number"
                placeholder="Max ₺"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              checked={onSale}
              onChange={() => setOnSale(!onSale)}
            />
            <span className="ml-2 text-sm text-gray-700">Sadece İndirimli Ürünler</span>
          </label>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={applyFilters}
            className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Filtrele
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter; 