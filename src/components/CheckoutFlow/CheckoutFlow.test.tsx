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

  it('shows item label in breakdown', () => {
    useCartStore.getState().addItem(100);
    render(<CheckoutFlow onClose={() => {}} />);
    expect(screen.getByText('小泡芙')).toBeInTheDocument();
  });

  it('shows item quantity and line total in breakdown', () => {
    useCartStore.getState().addItem(100);
    useCartStore.getState().addItem(100);
    render(<CheckoutFlow onClose={() => {}} />);
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getAllByText('$200').length).toBeGreaterThanOrEqual(1);
  });

  it('applies -10 discount on button click', async () => {
    useCartStore.getState().addItem(200);
    render(<CheckoutFlow onClose={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: '-10' }));
    expect(screen.getAllByText(/\$190/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/折扣 -10/)).toBeInTheDocument();
  });

  it('shows + sign for positive discount', async () => {
    useCartStore.getState().addItem(200);
    render(<CheckoutFlow onClose={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: '+10' }));
    expect(screen.getAllByText(/\$210/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/^\+10$/)).toBeInTheDocument();
  });

  it('applies +10 to restore discount on button click', async () => {
    useCartStore.getState().addItem(200);
    render(<CheckoutFlow onClose={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: '-10' }));
    await userEvent.click(screen.getByRole('button', { name: '+10' }));
    expect(screen.getAllByText(/\$200/).length).toBeGreaterThanOrEqual(1);
  });

  it('shows 自訂 for custom price items', () => {
    useCartStore.getState().addItem(75);
    render(<CheckoutFlow onClose={() => {}} />);
    expect(screen.getByText('自訂')).toBeInTheDocument();
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
