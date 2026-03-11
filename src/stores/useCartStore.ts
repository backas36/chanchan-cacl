import { create } from 'zustand';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  subtotal: number;
  addItem: (price: number) => void;
  removeItem: (price: number) => void;
  clearCart: () => void;
}

const calcSubtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,

  addItem: (price) => {
    const items = get().items;
    const existing = items.find((i) => i.price === price);
    const updated = existing
      ? items.map((i) => (i.price === price ? { ...i, quantity: i.quantity + 1 } : i))
      : [...items, { price, quantity: 1 }];
    set({ items: updated, subtotal: calcSubtotal(updated) });
  },

  removeItem: (price) => {
    const items = get().items;
    const existing = items.find((i) => i.price === price);
    if (!existing) return;
    const updated =
      existing.quantity > 1
        ? items.map((i) => (i.price === price ? { ...i, quantity: i.quantity - 1 } : i))
        : items.filter((i) => i.price !== price);
    set({ items: updated, subtotal: calcSubtotal(updated) });
  },

  clearCart: () => set({ items: [], subtotal: 0 }),
}));
