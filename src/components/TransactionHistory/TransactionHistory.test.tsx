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
      items: [{ price: 200, quantity: 1, isCustom: false, label: '草莓雪Q餅' }],
      subtotal: 200,
      discount: -20,
      total: 180,
      received: 200,
      change: 20,
    },
    {
      id: 'tx2',
      timestamp: '2024-01-01T14:00:00.000Z',
      items: [{ price: 50, quantity: 1, isCustom: false }],
      subtotal: 50,
      discount: 0,
      total: 50,
      received: 50,
      change: 0,
    },
  ],
  sessionTotal: 230,
};

const mockActiveSession: Session = {
  id: 'sess2',
  startTime: '2024-06-15T06:30:00.000Z',
  transactions: [],
  sessionTotal: 0,
};

describe('TransactionHistory', () => {
  it('shows empty state when no sessions', () => {
    render(<TransactionHistory sessions={[]} activeSession={null} userName='Ashi' />);
    expect(screen.getByText(/沒有紀錄/i)).toBeInTheDocument();
  });

  it('displays session total', () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName='Ashi' />);
    expect(screen.getByText(/\$230/)).toBeInTheDocument();
  });

  it('displays transactions within session', () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName='Ashi' />);
    expect(screen.getByText(/\$180/)).toBeInTheDocument();
    expect(screen.getByText(/\$50/)).toBeInTheDocument();
  });

  it('shows discount in transaction', () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName='Ashi' />);
    expect(screen.getByText(/-20/)).toBeInTheDocument();
  });

  it('copies session summary on button click', async () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName='Ashi' />);
    await userEvent.click(screen.getByRole('button', { name: /複製你的業績/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('Ashi'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('230'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('🍋 🫨'));
  });

  it('displays time range for ended session', () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName='Ashi' />);
    expect(screen.getByText((content) => content.includes(' ~ '))).toBeInTheDocument();
  });

  it('shows 進行中 for active session without endTime', () => {
    render(<TransactionHistory sessions={[]} activeSession={mockActiveSession} userName='Ashi' />);
    expect(screen.getByText(/進行中/)).toBeInTheDocument();
  });

  it('copies session summary including start time', async () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName='Ashi' />);
    await userEvent.click(screen.getByRole('button', { name: /複製你的業績/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringMatching(/\d{2}:\d{2}/));
  });

  it('transaction item details are hidden initially', () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName='Ashi' />);
    expect(screen.queryByText(/草莓雪Q餅/)).not.toBeInTheDocument();
  });

  it('shows item details when transaction is clicked', async () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName='Ashi' />);
    await userEvent.click(screen.getByText('$180'));
    expect(screen.getByText(/草莓雪Q餅/)).toBeInTheDocument();
  });

  it('hides item details on second click', async () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName='Ashi' />);
    await userEvent.click(screen.getByText('$180'));
    expect(screen.getByText(/草莓雪Q餅/)).toBeInTheDocument();
    await userEvent.click(screen.getByText('$180'));
    expect(screen.queryByText(/草莓雪Q餅/)).not.toBeInTheDocument();
  });

  it('copies session summary with full time range', async () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName='Ashi' />);
    await userEvent.click(screen.getByRole('button', { name: /複製你的業績/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining(' ~ '));
  });

  it('shows 已複製 feedback after copy button click', async () => {
    render(<TransactionHistory sessions={[mockSession]} activeSession={null} userName='Ashi' />);
    await userEvent.click(screen.getByRole('button', { name: /複製你的業績/i }));
    expect(screen.getByText(/已複製/)).toBeInTheDocument();
  });

  it('shows 自訂 for unknown price in item details', async () => {
    const sessionWithCustom: Session = {
      ...mockSession,
      transactions: [
        {
          id: 'tx3',
          timestamp: '2024-01-01T13:00:00.000Z',
          items: [{ price: 75, quantity: 1, isCustom: true }],
          subtotal: 75,
          discount: 0,
          total: 75,
          received: 75,
          change: 0,
        },
      ],
    };
    render(<TransactionHistory sessions={[sessionWithCustom]} activeSession={null} userName='Ashi' />);
    await userEvent.click(screen.getByText('$75'));
    expect(screen.getByText(/自訂/)).toBeInTheDocument();
  });
});
