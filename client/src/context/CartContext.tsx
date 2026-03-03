import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { MenuItem } from '../types/menu.types';

/* ── Types ────────────────────────────────── */
export interface CartItem {
    item: MenuItem;
    quantity: number;
}

interface CartContextValue {
    cartItems: CartItem[];
    totalCount: number;
    subtotal: number;
    addToCart: (item: MenuItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
}

/* ── Context ──────────────────────────────── */
const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'annapurna_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Persist to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    const totalCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
    const subtotal = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

    const addToCart = useCallback((item: MenuItem) => {
        setCartItems(prev => {
            const existing = prev.find(ci => ci.item._id === item._id);
            if (existing) {
                return prev.map(ci =>
                    ci.item._id === item._id
                        ? { ...ci, quantity: ci.quantity + 1 }
                        : ci
                );
            }
            return [...prev, { item, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((itemId: string) => {
        setCartItems(prev => prev.filter(ci => ci.item._id !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        if (quantity <= 0) {
            setCartItems(prev => prev.filter(ci => ci.item._id !== itemId));
        } else {
            setCartItems(prev =>
                prev.map(ci => ci.item._id === itemId ? { ...ci, quantity } : ci)
            );
        }
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, totalCount, subtotal, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextValue => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
    return ctx;
};
