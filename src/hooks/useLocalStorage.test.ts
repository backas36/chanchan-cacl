import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  it('returns initial value when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('reads existing value from localStorage', () => {
    localStorage.setItem('test_key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('test_key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('sets value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', ''));
    act(() => {
      result.current[1]('new value');
    });
    expect(result.current[0]).toBe('new value');
    expect(JSON.parse(localStorage.getItem('test_key')!)).toBe('new value');
  });

  it('works with object values', () => {
    const { result } = renderHook(() => useLocalStorage<{ x: number }>('obj_key', { x: 0 }));
    act(() => {
      result.current[1]({ x: 42 });
    });
    expect(result.current[0]).toEqual({ x: 42 });
  });

  it('returns initial value when localStorage has invalid JSON', () => {
    localStorage.setItem('bad_key', 'not-json{{{');
    const { result } = renderHook(() => useLocalStorage('bad_key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });
});
