import { create } from 'zustand';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  subtotal: number;
  addItem: (price: number, isCustom?: boolean) => void;
  removeItem: (price: number, isCustom?: boolean) => void;
  clearCart: () => void;
}

const calcSubtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const isSame = (i: CartItem, price: number, isCustom?: boolean) =>
  i.price === price && !!i.isCustom === !!isCustom;

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,

  addItem: (price, isCustom) => {
    const items = get().items;
    const existing = items.find((i) => isSame(i, price, isCustom));
    const updated = existing
      ? items.map((i) => (isSame(i, price, isCustom) ? { ...i, quantity: i.quantity + 1 } : i))
      : [...items, isCustom ? { price, quantity: 1, isCustom: true } : { price, quantity: 1 }];
    set({ items: updated, subtotal: calcSubtotal(updated) });
  },

  removeItem: (price, isCustom) => {
    const items = get().items;
    const existing = items.find((i) => isSame(i, price, isCustom));
    if (!existing) return;
    const updated =
      existing.quantity > 1
        ? items.map((i) => (isSame(i, price, isCustom) ? { ...i, quantity: i.quantity - 1 } : i))
        : items.filter((i) => !isSame(i, price, isCustom));
    set({ items: updated, subtotal: calcSubtotal(updated) });
  },

  clearCart: () => set({ items: [], subtotal: 0 }),
}));
