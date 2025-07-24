import { db } from "~/server/db";
import type { Cart } from "~/types/product";

export const createCart = async (): Promise<Cart> => {
  try {
    const cart = await db.cart.create({
      data: {},
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return cart as unknown as Cart;
  } catch {
    throw new Error("Failed to create cart");
  }
};

export const getCart = async (cartId: string): Promise<Cart | null> => {
  try {
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
    return cart as unknown as Cart | null;
  } catch {
    return null;
  }
};

export const addItemToCart = async (
  cartId: string,
  productId: string,
  quantity = 1,
): Promise<Cart | null> => {
  try {
    // Check if the item already exists in the cart
    const existingItem = await db.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
    });

    if (existingItem) {
      // Update the quantity of the existing item
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      // Create a new cart item
      await db.cartItem.create({
        data: {
          quantity,
          product: {
            connect: { id: productId },
          },
          cart: {
            connect: { id: cartId },
          },
        },
      });
    }

    // Return the updated cart
    return getCart(cartId);
  } catch {
    return null;
  }
};

export const removeItemFromCart = async (
  cartId: string,
  cartItemId: string,
): Promise<Cart | null> => {
  try {
    await db.cartItem.delete({
      where: { id: cartItemId },
    });

    return getCart(cartId);
  } catch {
    return null;
  }
};

export const updateCartItemQuantity = async (
  cartId: string,
  cartItemId: string,
  quantity: number,
): Promise<Cart | null> => {
  try {
    if (quantity <= 0) {
      return removeItemFromCart(cartId, cartItemId);
    }

    await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return getCart(cartId);
  } catch {
    return null;
  }
}; 