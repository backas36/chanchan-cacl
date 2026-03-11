import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PriceGrid } from './PriceGrid';
import { useCartStore } from '@/stores/useCartStore';
import { useSessionStore } from '@/stores/useSessionStore';

beforeEach(() => {
  useCartStore.getState().clearCart();
  useSessionStore.getState().resetAll();
});

describe('PriceGrid', () => {
  it('renders all product labels', () => {
    render(<PriceGrid />);
    // $60 瑪德蓮 button — match by variant text to avoid conflict with 香蕉蛋糕
    expect(screen.getByRole('button', { name: /蜂蜜/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /香蕉蛋糕/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /餅乾/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /小泡芙/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Oreo雪Q餅/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /金沙雪Q餅/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /草莓雪Q餅/ })).toBeInTheDocument();
  });

  it('renders variants on merged buttons', () => {
    render(<PriceGrid />);
    expect(screen.getByText(/蜂蜜.可可.泰奶.黑糖/)).toBeInTheDocument();
    expect(screen.getByText(/布朗妮.檸檬糖霜/)).toBeInTheDocument();
  });

  it('renders prices on all buttons', () => {
    render(<PriceGrid />);
    [50, 60, 80, 100, 160, 180, 200].forEach((p) => {
      expect(screen.getByRole('button', { name: new RegExp(`\\$${p}`) })).toBeInTheDocument();
    });
  });

  it('adds item to cart when product button clicked', async () => {
    useSessionStore.getState().startSession();
    render(<PriceGrid />);
    await userEvent.click(screen.getByRole('button', { name: /小泡芙/ }));
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].price).toBe(100);
  });

  it('adds merged item to cart by price when clicked', async () => {
    useSessionStore.getState().startSession();
    render(<PriceGrid />);
    // use variant text to specifically target the $60 瑪德蓮 button
    await userEvent.click(screen.getByRole('button', { name: /蜂蜜/ }));
    expect(useCartStore.getState().items[0].price).toBe(60);
  });

  it('renders custom amount button', () => {
    render(<PriceGrid />);
    expect(screen.getByRole('button', { name: /自訂/i })).toBeInTheDocument();
  });

  it('opens custom amount input when custom button clicked', async () => {
    useSessionStore.getState().startSession();
    render(<PriceGrid />);
    await userEvent.click(screen.getByRole('button', { name: /自訂/i }));
    expect(screen.getByPlaceholderText(/金額/i)).toBeInTheDocument();
  });

  it('adds custom amount to cart on confirm', async () => {
    useSessionStore.getState().startSession();
    render(<PriceGrid />);
    await userEvent.click(screen.getByRole('button', { name: /自訂/i }));
    await userEvent.type(screen.getByPlaceholderText(/金額/i), '75');
    await userEvent.click(screen.getByRole('button', { name: /確認/i }));
    expect(useCartStore.getState().items[0].price).toBe(75);
  });

  it('all buttons are disabled when no active session', () => {
    render(<PriceGrid />);
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('buttons are enabled when session is active', () => {
    useSessionStore.getState().startSession();
    render(<PriceGrid />);
    expect(screen.getByRole('button', { name: /小泡芙/ })).not.toBeDisabled();
  });
});
