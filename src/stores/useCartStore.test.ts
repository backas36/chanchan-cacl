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

  describe('same price different label', () => {
    it('items with same price but different label are separate cart items', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => result.current.addItem(200, undefined, '草莓雪Q餅'));
      act(() => result.current.addItem(200, undefined, '套餐'));
      expect(result.current.items).toHaveLength(2);
    });
  });

  describe('isCustom', () => {
    it('custom item does not merge with same-price catalog item', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => result.current.addItem(60));
      act(() => result.current.addItem(60, true));
      expect(result.current.items).toHaveLength(2);
    });

    it('custom items with same price merge together', () => {
      const { result } = renderHook(() => useCartStore());
      act(() => result.current.addItem(60, true));
      act(() => result.current.addItem(60, true));
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
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
