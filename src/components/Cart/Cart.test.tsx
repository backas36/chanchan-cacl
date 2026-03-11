import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Cart } from './Cart';
import { useCartStore } from '@/stores/useCartStore';
import { useSessionStore } from '@/stores/useSessionStore';

beforeEach(() => {
  useCartStore.getState().clearCart();
  useSessionStore.getState().resetAll();
});

describe('Cart', () => {
  it('shows empty state when cart is empty', () => {
    render(<Cart onCheckout={() => {}} />);
    expect(screen.getByText(/空的/i)).toBeInTheDocument();
  });

  it('displays cart items with label and quantity', () => {
    useCartStore.getState().addItem(100);
    useCartStore.getState().addItem(100);
    useCartStore.getState().addItem(50);
    render(<Cart onCheckout={() => {}} />);
    expect(screen.getByText('小泡芙')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText('餅乾')).toBeInTheDocument();
  });

  it('shows 自訂 for unknown price in cart', () => {
    useCartStore.getState().addItem(75);
    render(<Cart onCheckout={() => {}} />);
    expect(screen.getByText('自訂')).toBeInTheDocument();
  });

  it('shows subtotal', () => {
    useCartStore.getState().addItem(100);
    useCartStore.getState().addItem(50);
    render(<Cart onCheckout={() => {}} />);
    expect(screen.getByText(/\$150/)).toBeInTheDocument();
  });

  it('removes item when minus button clicked', async () => {
    useSessionStore.getState().startSession();
    useCartStore.getState().addItem(100);
    render(<Cart onCheckout={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /-/ }));
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('clears all items when clear button clicked', async () => {
    useSessionStore.getState().startSession();
    useCartStore.getState().addItem(100);
    useCartStore.getState().addItem(50);
    render(<Cart onCheckout={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /清空/i }));
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('calls onCheckout when checkout button clicked', async () => {
    useSessionStore.getState().startSession();
    useCartStore.getState().addItem(100);
    const onCheckout = vi.fn();
    render(<Cart onCheckout={onCheckout} />);
    await userEvent.click(screen.getByRole('button', { name: /結帳/i }));
    expect(onCheckout).toHaveBeenCalledOnce();
  });

  it('checkout button is disabled when cart is empty', () => {
    useSessionStore.getState().startSession();
    render(<Cart onCheckout={() => {}} />);
    expect(screen.getByRole('button', { name: /結帳/i })).toBeDisabled();
  });

  it('checkout and clear buttons are disabled when no active session', () => {
    useCartStore.getState().addItem(100);
    render(<Cart onCheckout={() => {}} />);
    expect(screen.getByRole('button', { name: /結帳/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /清空/i })).toBeDisabled();
  });
});
