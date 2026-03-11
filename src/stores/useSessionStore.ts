import { create } from 'zustand';
import type { Session, Transaction } from '@/types';

type NewTransaction = Omit<Transaction, 'id' | 'timestamp'>;

interface SessionState {
  sessions: Session[];
  activeSession: Session | null;
  startSession: () => void;
  endSession: () => void;
  addTransaction: (tx: NewTransaction) => void;
  resetAll: () => void;
}

const genId = () => Math.random().toString(36).slice(2, 10);

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  activeSession: null,

  startSession: () => {
    const session: Session = {
      id: genId(),
      startTime: new Date().toISOString(),
      transactions: [],
      sessionTotal: 0,
    };
    set({ activeSession: session });
  },

  endSession: () => {
    const { activeSession, sessions } = get();
    if (!activeSession) return;
    const closed = { ...activeSession, endTime: new Date().toISOString() };
    set({ activeSession: null, sessions: [...sessions, closed] });
  },

  addTransaction: (tx: NewTransaction) => {
    const { activeSession } = get();
    if (!activeSession) return;
    const transaction: Transaction = {
      ...tx,
      id: genId(),
      timestamp: new Date().toISOString(),
    };
    const updated: Session = {
      ...activeSession,
      transactions: [...activeSession.transactions, transaction],
      sessionTotal: activeSession.sessionTotal + transaction.total,
    };
    set({ activeSession: updated });
  },

  resetAll: () => set({ sessions: [], activeSession: null }),
}));
