import { create } from 'zustand';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  subtotal: number;
  addItem: (price: number, isCustom?: boolean, label?: string) => void;
  removeItem: (price: number, isCustom?: boolean, label?: string) => void;
  clearCart: () => void;
}

const calcSubtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const isSame = (i: CartItem, price: number, isCustom?: boolean, label?: string) =>
  i.price === price && !!i.isCustom === !!isCustom && i.label === label;

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,

  addItem: (price, isCustom, label) => {
    const items = get().items;
    const existing = items.find((i) => isSame(i, price, isCustom, label));
    const newItem: CartItem = isCustom
      ? { price, quantity: 1, isCustom: true }
      : { price, quantity: 1, label };
    const updated = existing
      ? items.map((i) => (isSame(i, price, isCustom, label) ? { ...i, quantity: i.quantity + 1 } : i))
      : [...items, newItem];
    set({ items: updated, subtotal: calcSubtotal(updated) });
  },

  removeItem: (price, isCustom, label) => {
    const items = get().items;
    const existing = items.find((i) => isSame(i, price, isCustom, label));
    if (!existing) return;
    const updated =
      existing.quantity > 1
        ? items.map((i) => (isSame(i, price, isCustom, label) ? { ...i, quantity: i.quantity - 1 } : i))
        : items.filter((i) => !isSame(i, price, isCustom, label));
    set({ items: updated, subtotal: calcSubtotal(updated) });
  },

  clearCart: () => set({ items: [], subtotal: 0 }),
}));
