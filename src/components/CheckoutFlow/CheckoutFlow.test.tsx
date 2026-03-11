import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckoutFlow } from './CheckoutFlow';
import { useCartStore } from '@/stores/useCartStore';
import { useSessionStore } from '@/stores/useSessionStore';

beforeEach(() => {
  useCartStore.getState().clearCart();
  useSessionStore.getState().resetAll();
  useSessionStore.getState().startSession();
});

describe('CheckoutFlow', () => {
  it('shows subtotal from cart', () => {
    useCartStore.getState().addItem(100);
    useCartStore.getState().addItem(50);
    render(<CheckoutFlow onClose={() => {}} />);
    expect(screen.getAllByText(/\$150/).length).toBeGreaterThanOrEqual(1);
  });

  it('shows discounted total after applying discount', async () => {
    useCartStore.getState().addItem(200);
    render(<CheckoutFlow onClose={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: '-50' }));
    expect(screen.getAllByText(/\$150/).length).toBeGreaterThanOrEqual(1);
  });

  it('completes checkout and clears cart', async () => {
    useCartStore.getState().addItem(100);
    render(<CheckoutFlow onClose={() => {}} />);
    const input = screen.getByPlaceholderText(/收款/i);
    await userEvent.type(input, '100');
    await userEvent.click(screen.getByRole('button', { name: /完成/i }));
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('saves transaction to session on complete', async () => {
    useCartStore.getState().addItem(100);
    render(<CheckoutFlow onClose={() => {}} />);
    const input = screen.getByPlaceholderText(/收款/i);
    await userEvent.type(input, '100');
    await userEvent.click(screen.getByRole('button', { name: /完成/i }));
    expect(useSessionStore.getState().activeSession?.transactions).toHaveLength(1);
  });

  it('calls onClose after completing checkout', async () => {
    useCartStore.getState().addItem(100);
    const onClose = vi.fn();
    render(<CheckoutFlow onClose={onClose} />);
    const input = screen.getByPlaceholderText(/收款/i);
    await userEvent.type(input, '100');
    await userEvent.click(screen.getByRole('button', { name: /完成/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
