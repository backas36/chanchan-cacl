import { useSessionStore } from '@/stores/useSessionStore';

interface SessionPanelProps {
  userName: string;
}

export function SessionPanel({ userName }: SessionPanelProps) {
  const { activeSession, startSession, endSession } = useSessionStore();

  return (
    <div className="flex items-center justify-between rounded-xl bg-cream p-3">
      <p className="text-sm text-gray-500">{userName}</p>
      <div className="flex gap-2">
        {activeSession ? (
          <button
            onClick={endSession}
            className="rounded-lg bg-red-400 px-3 py-1 text-sm font-bold text-white"
          >
            結束場次
          </button>
        ) : (
          <button
            onClick={startSession}
            className="rounded-lg bg-brand px-3 py-1 text-sm font-bold text-white"
          >
            開始場次
          </button>
        )}
      </div>
    </div>
  );
}
