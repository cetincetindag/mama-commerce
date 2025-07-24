import { db } from "~/server/db";
import type { Product, ProductFilter } from "~/types/product";
import { type Prisma } from "@prisma/client";

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return products as unknown as Product[];
  } catch {
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const product = await db.product.findUnique({
      where: { id },
    });
    return product as unknown as Product | null;
  } catch {
    return null;
  }
};

export const getProductsByType = async (type: string): Promise<Product[]> => {
  try {
    const products = await db.product.findMany({
      where: { type },
      orderBy: {
        createdAt: "desc",
      },
    });
    return products as unknown as Product[];
  } catch {
    return [];
  }
};

export const getSaleProducts = async (): Promise<Product[]> => {
  try {
    const products = await db.product.findMany({
      where: {
        salePrice: {
          not: null,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return products as unknown as Product[];
  } catch {
    return [];
  }
};

export const getFilteredProducts = async (
  filters: ProductFilter,
): Promise<Product[]> => {
  const { type, onSale, minPrice, maxPrice } = filters;

  try {
    const whereClause: Prisma.ProductWhereInput = {};

    if (type && type.length > 0) {
      whereClause.type = { in: type };
    }

    if (onSale) {
      whereClause.salePrice = { not: null };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      
      if (minPrice !== undefined) {
        whereClause.price = { ...whereClause.price, gte: minPrice };
      }
      
      if (maxPrice !== undefined) {
        whereClause.price = { ...whereClause.price, lte: maxPrice };
      }
    }

    const products = await db.product.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return products as unknown as Product[];
  } catch {
    return [];
  }
}; 