"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchProducts, UiProduct } from "../supabase/products";

interface ProductsContextType {
  products: UiProduct[];
  loading: boolean;
  refresh: () => void;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, refresh: load }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
