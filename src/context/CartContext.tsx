'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';
import { INITIAL_SETTINGS } from '@/data/db';
import { trackEvent } from '@/utils/analytics';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  isFreeShippingReached: boolean;
  coupon: string | null;
  discountPercent: number;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Carregar do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bazar_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem('bazar_coupon');
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        setCoupon(parsed.code);
        setDiscountPercent(parsed.percent);
      }
    } catch (e) {
      console.error('Falha ao carregar carrinho local', e);
    }
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bazar_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Falha ao salvar carrinho', e);
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    trackEvent('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      price: product.promotionalPrice || product.price,
      quantity,
    });

    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setDiscountPercent(0);
    try {
      localStorage.removeItem('bazar_cart');
      localStorage.removeItem('bazar_coupon');
    } catch (e) {}
  };

  const subtotal = items.reduce((acc, item) => {
    const price = item.product.promotionalPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const freeShippingThreshold = INITIAL_SETTINGS.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const isFreeShippingReached = subtotal >= freeShippingThreshold;

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = INITIAL_SETTINGS.activeCoupons.find((c) => c.code === cleanCode);

    if (!found) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }

    if (subtotal < found.minSubtotal) {
      return {
        success: false,
        message: `Este cupom requer um pedido mínimo de R$ ${found.minSubtotal.toFixed(2)}.`,
      };
    }

    setCoupon(cleanCode);
    setDiscountPercent(found.discountPercent);
    try {
      localStorage.setItem('bazar_coupon', JSON.stringify({ code: cleanCode, percent: found.discountPercent }));
    } catch (e) {}

    return {
      success: true,
      message: `Cupom ${cleanCode} ativado com sucesso! (${found.discountPercent}% OFF)`,
    };
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscountPercent(0);
    try {
      localStorage.removeItem('bazar_coupon');
    } catch (e) {}
  };

  const discountAmount = (subtotal * discountPercent) / 100;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        freeShippingThreshold,
        remainingForFreeShipping,
        isFreeShippingReached,
        coupon,
        discountPercent,
        discountAmount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser utilizado dentro de um CartProvider');
  }
  return context;
}
