import { act, renderHook } from '@testing-library/react';
import { useCartStore } from './useCartStore';

beforeEach(() => {
  useCartStore.getState().clearCart();
});

describe('useCartStore', () => {
  describe('addItem', () => {
    it('adds a new item to cart', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => result.current.addItem(100));
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual({ price: 100, quantity: 1 });
    });

    it('increments quantity if same price already in cart', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => result.current.addItem(100));
      act(() => result.current.addItem(100));
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });

    it('adds separate items for different prices', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => result.current.addItem(100));
      act(() => result.current.addItem(50));
      expect(result.current.items).toHaveLength(2);
    });
  });

  describe('removeItem', () => {
    it('removes item from cart', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => result.current.addItem(100));
      act(() => result.current.removeItem(100));
      expect(result.current.items).toHaveLength(0);
    });

    it('decrements quantity if quantity > 1', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => result.current.addItem(100));
      act(() => result.current.addItem(100));
      act(() => result.current.removeItem(100));
      expect(result.current.items[0].quantity).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('removes all items', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => result.current.addItem(100));
      act(() => result.current.addItem(50));
      act(() => result.current.clearCart());
      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('subtotal', () => {
    it('returns 0 for empty cart', () => {
      const { result } = renderHook(() => useCartStore());
      expect(result.current.subtotal).toBe(0);
    });

    it('calculates correct subtotal', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => result.current.addItem(100));
      act(() => result.current.addItem(100));
      act(() => result.current.addItem(50));
      expect(result.current.subtotal).toBe(250);
    });
  });
});
