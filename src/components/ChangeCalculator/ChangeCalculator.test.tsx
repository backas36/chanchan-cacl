import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangeCalculator } from './ChangeCalculator';

describe('ChangeCalculator', () => {
  it('shows total amount', () => {
    render(<ChangeCalculator total={150} onReceivedChange={() => {}} received={0} />);
    expect(screen.getByText(/\$150/)).toBeInTheDocument();
  });

  it('calculates and displays change', () => {
    render(<ChangeCalculator total={150} onReceivedChange={() => {}} received={200} />);
    expect(screen.getByText(/\$50/)).toBeInTheDocument();
  });

  it('shows zero change when received equals total', () => {
    render(<ChangeCalculator total={150} onReceivedChange={() => {}} received={150} />);
    expect(screen.getByText(/\$0/)).toBeInTheDocument();
  });

  it('calls onReceivedChange when user types received amount', async () => {
    const onReceivedChange = vi.fn();
    render(<ChangeCalculator total={150} onReceivedChange={onReceivedChange} received={0} />);
    const input = screen.getByPlaceholderText(/收款/i);
    await userEvent.type(input, '2');
    expect(onReceivedChange).toHaveBeenCalled();
  });

  it('shows negative change when received is less than total', () => {
    render(<ChangeCalculator total={150} onReceivedChange={() => {}} received={100} />);
    expect(screen.getByText(/-50/)).toBeInTheDocument();
  });
});
