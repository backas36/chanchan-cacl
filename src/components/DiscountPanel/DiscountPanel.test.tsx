import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiscountPanel } from './DiscountPanel';

describe('DiscountPanel', () => {
  it('renders quick discount buttons', () => {
    render(<DiscountPanel discount={0} onDiscountChange={() => {}} />);
    expect(screen.getByRole('button', { name: '-50' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-20' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-10' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+10' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+20' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+50' })).toBeInTheDocument();
  });

  it('calls onDiscountChange with adjusted value when quick button clicked', async () => {
    const onDiscountChange = vi.fn();
    render(<DiscountPanel discount={0} onDiscountChange={onDiscountChange} />);
    await userEvent.click(screen.getByRole('button', { name: '-50' }));
    expect(onDiscountChange).toHaveBeenCalledWith(-50);
  });

  it('accumulates discount on multiple clicks', async () => {
    const onDiscountChange = vi.fn();
    render(<DiscountPanel discount={-50} onDiscountChange={onDiscountChange} />);
    await userEvent.click(screen.getByRole('button', { name: '-20' }));
    expect(onDiscountChange).toHaveBeenCalledWith(-70);
  });

  it('shows current discount amount', () => {
    render(<DiscountPanel discount={-30} onDiscountChange={() => {}} />);
    expect(screen.getByText(/-30/)).toBeInTheDocument();
  });

  it('allows custom discount input', async () => {
    const onDiscountChange = vi.fn();
    render(<DiscountPanel discount={0} onDiscountChange={onDiscountChange} />);
    const input = screen.getByPlaceholderText(/自訂/i);
    await userEvent.type(input, '-15');
    await userEvent.keyboard('{Enter}');
    expect(onDiscountChange).toHaveBeenCalledWith(-15);
  });
});
