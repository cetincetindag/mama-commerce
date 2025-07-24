import { db } from "~/server/db";
import type { Order } from "~/types/product";

type CreateOrderInput = {
  cartId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

export const createOrder = async (
  input: CreateOrderInput,
): Promise<Order | null> => {
  try {
    const { cartId, fullName, email, phone, address } = input;

    // Get cart with items
    const cart = await db.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty or not found");
    }

    // Calculate total
    const total = cart.items.reduce((acc, item) => {
      const price = item.product.salePrice ?? item.product.price;
      return acc + price * item.quantity;
    }, 0);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(
      Math.random() * 1000,
    )}`;

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        fullName,
        email,
        phone,
        address,
        total,
        items: {
          create: cart.items.map((item) => ({
            quantity: item.quantity,
            price: item.product.salePrice ?? item.product.price,
            product: {
              connect: { id: item.product.id },
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear cart after order is created
    await db.cartItem.deleteMany({
      where: { cartId },
    });

    return order as unknown as Order;
  } catch {
    return null;
  }
};

export const getOrderByNumber = async (
  orderNumber: string,
): Promise<Order | null> => {
  try {
    const order = await db.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return order as unknown as Order | null;
  } catch {
    return null;
  }
}; 