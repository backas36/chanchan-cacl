import { useState } from 'react';
import type { Session } from '@/types';
import itemData from '@/data/itemData.json';

interface TransactionHistoryProps {
  sessions: Session[];
  activeSession: Session | null;
  userName: string;
  onResetAll: () => void;
}

const priceToLabel = new Map(itemData.items.map((item) => [item.price, item.label]));

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
}

export function TransactionHistory({ sessions, activeSession, userName, onResetAll }: TransactionHistoryProps) {
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  const [copiedSessionId, setCopiedSessionId] = useState<string | null>(null);
  const allSessions = activeSession ? [activeSession, ...sessions] : sessions;

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

  const handleReset = () => {
    if (window.confirm('⚠️ 確定要重置所有資料嗎？這會刪除你的名字、場次、業績紀錄，且不可復原！')) {
      if (window.confirm('🔥 真的確定？這是最後一次確認！所有紀錄都會消失！')) {
        onResetAll();
      }
    }
  };

  return (
    <div className='space-y-4'>
      {allSessions.length === 0 ? (
        <p className='py-8 text-center text-gray-400'>沒有紀錄</p>
      ) : (
        allSessions.map((session) => {
          const date = new Date(session.startTime).toLocaleDateString('zh-TW');
          const startTime = formatTime(session.startTime);
          const endTime = session.endTime ? formatTime(session.endTime) : '進行中';

          return (
            <div key={session.id} className='rounded-xl bg-white p-4 shadow-sm'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm text-gray-500'>
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
                          <li key={idx} className='flex justify-between text-xs text-gray-500'>
                            <span>
                              {item.isCustom ? '自訂' : (priceToLabel.get(item.price) ?? '自訂')} ×{item.quantity}
                            </span>
                            <span>${item.price * item.quantity}</span>
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
                {copiedSessionId === session.id ? '✓ 已複製' : '複製結果'}
              </button>
            </div>
          );
        })
      )}

      {/* 隱藏的重置按鈕 */}
      <div className='mt-20 pb-10'>
        <button
          onClick={handleReset}
          className='absolute bottom-6 rounded-lg border border-red-50 px-2 py-1 text-[10px] font-medium text-red-200 active:bg-red-50'
        >
          重置全部資料
        </button>
      </div>
    </div>
  );
}
