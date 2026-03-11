import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionPanel } from './SessionPanel';
import { useSessionStore } from '@/stores/useSessionStore';

beforeEach(() => {
  useSessionStore.getState().resetAll();
});

describe('SessionPanel', () => {
  it('shows start session button when no active session', () => {
    render(<SessionPanel userName="Ashi" />);
    expect(screen.getByRole('button', { name: /開始場次/i })).toBeInTheDocument();
  });

  it('starts a session when button clicked', async () => {
    render(<SessionPanel userName="Ashi" />);
    await userEvent.click(screen.getByRole('button', { name: /開始場次/i }));
    expect(useSessionStore.getState().activeSession).not.toBeNull();
  });

  it('shows end session button when session is active', () => {
    useSessionStore.getState().startSession();
    render(<SessionPanel userName="Ashi" />);
    expect(screen.getByRole('button', { name: /結束場次/i })).toBeInTheDocument();
  });

  it('ends session when end button clicked', async () => {
    useSessionStore.getState().startSession();
    render(<SessionPanel userName="Ashi" />);
    await userEvent.click(screen.getByRole('button', { name: /結束場次/i }));
    expect(useSessionStore.getState().activeSession).toBeNull();
  });

  it('shows current session total', () => {
    useSessionStore.getState().startSession();
    render(<SessionPanel userName="Ashi" />);
    expect(screen.getByText(/\$0/)).toBeInTheDocument();
  });

  it('shows user name', () => {
    render(<SessionPanel userName="Ashi" />);
    expect(screen.getByText(/Ashi/)).toBeInTheDocument();
  });

  it('copies summary to clipboard', async () => {
    useSessionStore.getState().startSession();
    useSessionStore.getState().addTransaction({
      items: [{ price: 100, quantity: 1 }],
      subtotal: 100,
      discount: 0,
      total: 100,
      received: 100,
      change: 0,
    });
    render(<SessionPanel userName="Ashi" />);
    await userEvent.click(screen.getByRole('button', { name: /複製/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('Ashi'));
  });
});
