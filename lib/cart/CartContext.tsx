"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CartContextType {
  cart: Record<number, number>;
  addToCart: (id: number) => void;
  changeQty: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<number, number>>({});

  function addToCart(id: number) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }

  function changeQty(id: number, delta: number) {
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[id] || 0) + delta;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  function removeFromCart(id: number) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, changeQty, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
