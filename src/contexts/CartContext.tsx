import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product } from '@/hooks/useProducts';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => setItems([]);

  const total = useMemo(() => items.reduce((s, i) => s + i.product.price * i.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
