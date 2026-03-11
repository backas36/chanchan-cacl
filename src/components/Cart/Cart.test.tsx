import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Cart } from './Cart';
import { useCartStore } from '@/stores/useCartStore';

beforeEach(() => {
  useCartStore.getState().clearCart();
});

describe('Cart', () => {
  it('shows empty state when cart is empty', () => {
    render(<Cart onCheckout={() => {}} />);
    expect(screen.getByText(/空的/i)).toBeInTheDocument();
  });

  it('displays cart items with price and quantity', () => {
    useCartStore.getState().addItem(100);
    useCartStore.getState().addItem(100);
    useCartStore.getState().addItem(50);
    render(<Cart onCheckout={() => {}} />);
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
  });

  it('shows subtotal', () => {
    useCartStore.getState().addItem(100);
    useCartStore.getState().addItem(50);
    render(<Cart onCheckout={() => {}} />);
    expect(screen.getByText(/\$150/)).toBeInTheDocument();
  });

  it('removes item when minus button clicked', async () => {
    useCartStore.getState().addItem(100);
    render(<Cart onCheckout={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /-/ }));
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('clears all items when clear button clicked', async () => {
    useCartStore.getState().addItem(100);
    useCartStore.getState().addItem(50);
    render(<Cart onCheckout={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /清空/i }));
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('calls onCheckout when checkout button clicked', async () => {
    useCartStore.getState().addItem(100);
    const onCheckout = vi.fn();
    render(<Cart onCheckout={onCheckout} />);
    await userEvent.click(screen.getByRole('button', { name: /結帳/i }));
    expect(onCheckout).toHaveBeenCalledOnce();
  });

  it('checkout button is disabled when cart is empty', () => {
    render(<Cart onCheckout={() => {}} />);
    expect(screen.getByRole('button', { name: /結帳/i })).toBeDisabled();
  });
});
