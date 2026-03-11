import { act, renderHook } from '@testing-library/react';
import { useSessionStore } from './useSessionStore';
import type { CartItem } from '@/types';

const mockItems: CartItem[] = [{ price: 100, quantity: 2 }];

beforeEach(() => {
  useSessionStore.getState().resetAll();
});

describe('useSessionStore', () => {
  describe('startSession', () => {
    it('creates a new active session', () => {
      const { result } = renderHook(() => useSessionStore());
      act(() => result.current.startSession());
      expect(result.current.activeSession).not.toBeNull();
      expect(result.current.activeSession?.transactions).toHaveLength(0);
    });
  });

  describe('addTransaction', () => {
    it('adds transaction to active session', () => {
      const { result } = renderHook(() => useSessionStore());
      act(() => result.current.startSession());
      act(() =>
        result.current.addTransaction({
          items: mockItems,
          subtotal: 200,
          discount: -20,
          total: 180,
          received: 200,
          change: 20,
        }),
      );
      expect(result.current.activeSession?.transactions).toHaveLength(1);
    });

    it('updates session total after adding transaction', () => {
      const { result } = renderHook(() => useSessionStore());
      act(() => result.current.startSession());
      act(() =>
        result.current.addTransaction({
          items: mockItems,
          subtotal: 200,
          discount: 0,
          total: 200,
          received: 200,
          change: 0,
        }),
      );
      expect(result.current.activeSession?.sessionTotal).toBe(200);
    });

    it('does nothing when no active session', () => {
      const { result } = renderHook(() => useSessionStore());
      act(() =>
        result.current.addTransaction({
          items: mockItems,
          subtotal: 100,
          discount: 0,
          total: 100,
          received: 100,
          change: 0,
        }),
      );
      expect(result.current.activeSession).toBeNull();
    });
  });

  describe('endSession', () => {
    it('moves active session to sessions history', () => {
      const { result } = renderHook(() => useSessionStore());
      act(() => result.current.startSession());
      act(() => result.current.endSession());
      expect(result.current.activeSession).toBeNull();
      expect(result.current.sessions).toHaveLength(1);
    });

    it('sets endTime on session', () => {
      const { result } = renderHook(() => useSessionStore());
      act(() => result.current.startSession());
      act(() => result.current.endSession());
      expect(result.current.sessions[0].endTime).toBeDefined();
    });
  });

  describe('sessions history', () => {
    it('accumulates multiple sessions', () => {
      const { result } = renderHook(() => useSessionStore());
      act(() => result.current.startSession());
      act(() => result.current.endSession());
      act(() => result.current.startSession());
      act(() => result.current.endSession());
      expect(result.current.sessions).toHaveLength(2);
    });
  });
});
