export type Product = {
  id: string;
  name: string;
  description: string;
  materialInfo?: string | null;
  price: number;
  salePrice?: number | null;
  images: string; // Comma-separated URLs
  type: string;
  width?: number | null;
  height?: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductType = 
  | 'bel-çantası' 
  | 'kol-çantası' 
  | 'omuz-çantası' 
  | 'sırt-çantası' 
  | 'el-çantası'
  | 'kolye'
  | 'bilezik'
  | 'yüzük'
  | 'halhal';

export type ProductFilter = {
  type?: ProductType[];
  onSale?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

export type CartItem = {
  id: string;
  quantity: number;
  product: Product;
};

export type Cart = {
  id: string;
  items: CartItem[];
};

export type OrderStatus = 'beklemede' | 'odeme_bekleniyor' | 'odendi_kargo_bekleniyor' | 'kargoya_verildi' | 'teslim_edildi' | 'iptal_edildi';

export type Order = {
  id: string;
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: Product;
  }[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}; 