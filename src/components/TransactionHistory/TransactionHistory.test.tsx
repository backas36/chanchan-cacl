import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionHistory } from './TransactionHistory';
import type { Session } from '@/types';

const mockSession: Session = {
  id: 'sess1',
  startTime: '2024-01-01T10:00:00.000Z',
  endTime: '2024-01-01T18:00:00.000Z',
  transactions: [
    {
      id: 'tx1',
      timestamp: '2024-01-01T12:00:00.000Z',
      items: [{ price: 100, quantity: 2 }],
      subtotal: 200,
      discount: -20,
      total: 180,
      received: 200,
      change: 20,
    },
    {
      id: 'tx2',
      timestamp: '2024-01-01T14:00:00.000Z',
      items: [{ price: 50, quantity: 1 }],
      subtotal: 50,
      discount: 0,
      total: 50,
      received: 50,
      change: 0,
    },
  ],
  sessionTotal: 230,
};

describe('TransactionHistory', () => {
  it('shows empty state when no sessions', () => {
    render(<TransactionHistory sessions={[]} activeSession={null} userName="Ashi" />);
    expect(screen.getByText(/沒有紀錄/i)).toBeInTheDocument();
  });

  it('displays session total', () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName="Ashi" />);
    expect(screen.getByText(/\$230/)).toBeInTheDocument();
  });

  it('displays transactions within session', () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName="Ashi" />);
    expect(screen.getByText(/\$180/)).toBeInTheDocument();
    expect(screen.getByText(/\$50/)).toBeInTheDocument();
  });

  it('shows discount in transaction', () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName="Ashi" />);
    expect(screen.getByText(/-20/)).toBeInTheDocument();
  });

  it('copies session summary on button click', async () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName="Ashi" />);
    await userEvent.click(screen.getByRole('button', { name: /複製結果/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('Ashi'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('230'));
  });
});
