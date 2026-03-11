import { useState } from 'react';
import type { Session } from '@/types';

interface TransactionHistoryProps {
  sessions: Session[];
  activeSession: Session | null;
  userName: string;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function TransactionHistory({ sessions, activeSession, userName }: TransactionHistoryProps) {
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  const [copiedSessionId, setCopiedSessionId] = useState<string | null>(null);
  const allSessions = activeSession ? [activeSession, ...sessions] : sessions;
  const sortedSessions = [...allSessions].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
  );

  const handleCopySession = async (session: Session) => {
    const date = new Date(session.startTime).toLocaleDateString('zh-TW');
    const startTime = formatTime(session.startTime);
    const endTime = session.endTime ? formatTime(session.endTime) : '進行中';
    const text = `😎 ${userName} 在 ${date} ${startTime} ~ ${endTime} 賺了 $${session.sessionTotal} 元  🍋 🫨`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedSessionId(session.id);
    setTimeout(() => setCopiedSessionId(null), 2000);
  };

  return (
    <div className='space-y-4'>
      {sortedSessions.length === 0 ? (
        <p className='py-8 text-center text-gray-400'>沒有紀錄</p>
      ) : (
        sortedSessions.map((session) => {
          const date = new Date(session.startTime).toLocaleDateString('zh-TW');
          const startTime = formatTime(session.startTime);
          const endTime = session.endTime ? formatTime(session.endTime) : '進行中';

          return (
            <div key={session.id} className='rounded-xl bg-white p-4 shadow-sm'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-bold text-gray-600'>
                  {date}　{startTime} ~ {endTime}
                </span>
                <span className='text-lg font-bold'>${session.sessionTotal}</span>
              </div>

              <ul className='space-y-1'>
                {session.transactions.map((tx) => (
                  <li key={tx.id}>
                    <div
                      className='flex cursor-pointer justify-between rounded bg-gray-50 px-2 py-1 text-sm'
                      onClick={() => setExpandedTxId(expandedTxId === tx.id ? null : tx.id)}
                    >
                      <span className='text-gray-500'>
                        {new Date(tx.timestamp).toLocaleTimeString('zh-TW', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </span>
                      <span>
                        {tx.discount !== 0 && (
                          <span className={`mr-1 ${tx.discount > 0 ? 'text-green-500' : 'text-red-400'}`}>
                            {tx.discount > 0 ? `+${tx.discount}` : tx.discount}
                          </span>
                        )}
                        <span className='font-medium'>${tx.total}</span>
                      </span>
                    </div>
                    {expandedTxId === tx.id && (
                      <ul className='mt-1 space-y-0.5 px-2'>
                        {tx.items.map((item, idx) => (
                          <li key={idx} className='flex items-center gap-2 text-xs text-gray-500'>
                            <span className='flex-1 font-medium'>{item.isCustom ? '自訂' : (item.label ?? '自訂')}</span>
                            <span className='text-gray-400'>${item.price}</span>
                            <span className='w-8 text-center'>×{item.quantity}</span>
                            <span className='w-14 text-right'>${item.price * item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCopySession(session)}
                className={`mt-2 w-full rounded-lg py-2 text-sm font-medium ${copiedSessionId === session.id ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
              >
                {copiedSessionId === session.id ? '✓ 已複製' : '複製你的業績❤️'}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
