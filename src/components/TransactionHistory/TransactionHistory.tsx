import type { Session } from '@/types';

interface TransactionHistoryProps {
  sessions: Session[];
  activeSession: Session | null;
  userName: string;
}

export function TransactionHistory({ sessions, activeSession, userName }: TransactionHistoryProps) {
  const allSessions = activeSession ? [activeSession, ...sessions] : sessions;

  const handleCopySession = (session: Session) => {
    const date = new Date(session.startTime).toLocaleDateString('zh-TW');
    const text = `${userName} ${date} 賺了 $${session.sessionTotal} 元`;
    navigator.clipboard.writeText(text);
  };

  if (allSessions.length === 0) {
    return <p className="py-8 text-center text-gray-400">沒有紀錄</p>;
  }

  return (
    <div className="space-y-4">
      {allSessions.map((session) => (
        <div key={session.id} className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {new Date(session.startTime).toLocaleDateString('zh-TW')}
            </span>
            <span className="text-lg font-bold">${session.sessionTotal}</span>
          </div>

          <ul className="space-y-1">
            {session.transactions.map((tx) => (
              <li key={tx.id} className="flex justify-between rounded bg-gray-50 px-2 py-1 text-sm">
                <span className="text-gray-500">
                  {new Date(tx.timestamp).toLocaleTimeString('zh-TW', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span>
                  {tx.discount !== 0 && (
                    <span className="mr-1 text-red-400">{tx.discount}</span>
                  )}
                  <span className="font-medium">${tx.total}</span>
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleCopySession(session)}
            className="mt-2 w-full rounded-lg bg-gray-100 py-2 text-sm font-medium"
          >
            複製結果
          </button>
        </div>
      ))}
    </div>
  );
}
