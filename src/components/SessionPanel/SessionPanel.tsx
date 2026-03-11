import { useSessionStore } from '@/stores/useSessionStore';

interface SessionPanelProps {
  userName: string;
}

export function SessionPanel({ userName }: SessionPanelProps) {
  const { activeSession, startSession, endSession } = useSessionStore();

  const sessionTotal = activeSession?.sessionTotal ?? 0;

  const handleCopy = () => {
    const text = `${userName} 今天賺了 $${sessionTotal} 元`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex items-center justify-between rounded-xl bg-amber-50 p-3">
      <div>
        <p className="text-sm text-gray-500">{userName}</p>
        <p className="text-xl font-bold">${sessionTotal}</p>
      </div>
      <div className="flex gap-2">
        {activeSession ? (
          <>
            <button
              onClick={handleCopy}
              className="rounded-lg bg-gray-200 px-3 py-1 text-sm font-medium"
            >
              複製
            </button>
            <button
              onClick={endSession}
              className="rounded-lg bg-red-400 px-3 py-1 text-sm font-bold text-white"
            >
              結束場次
            </button>
          </>
        ) : (
          <button
            onClick={startSession}
            className="rounded-lg bg-amber-400 px-3 py-1 text-sm font-bold"
          >
            開始場次
          </button>
        )}
      </div>
    </div>
  );
}
