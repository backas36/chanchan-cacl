import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSessionStore } from '@/stores/useSessionStore';
import { NameSetupModal } from '@/components/NameSetupModal/NameSetupModal';
import { SessionPanel } from '@/components/SessionPanel/SessionPanel';
import { PriceGrid } from '@/components/PriceGrid/PriceGrid';
import { Cart } from '@/components/Cart/Cart';
import { CheckoutFlow } from '@/components/CheckoutFlow/CheckoutFlow';
import { TransactionHistory } from '@/components/TransactionHistory/TransactionHistory';

type Tab = 'calculator' | 'history';

function App() {
  const [userName, setUserName] = useLocalStorage('cc_user_name', '');
  const [tab, setTab] = useState<Tab>('calculator');
  const [showCheckout, setShowCheckout] = useState(false);
  const { sessions, activeSession } = useSessionStore();

  if (!userName) {
    return <NameSetupModal onSave={setUserName} />;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col bg-gray-50">
      {/* Header */}
      <div className="p-3">
        <SessionPanel userName={userName} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {tab === 'calculator' ? (
          <div className="space-y-3">
            <Cart onCheckout={() => setShowCheckout(true)} />
            <PriceGrid />
          </div>
        ) : (
          <TransactionHistory sessions={sessions} activeSession={activeSession} userName={userName} />
        )}
      </div>

      {/* Bottom Tabs */}
      <div className="flex border-t bg-white">
        <button
          onClick={() => setTab('calculator')}
          className={`flex-1 py-3 text-sm font-medium ${tab === 'calculator' ? 'border-t-2 border-amber-500 text-amber-600' : 'text-gray-400'}`}
        >
          收銀機
        </button>
        <button
          onClick={() => setTab('history')}
          className={`flex-1 py-3 text-sm font-medium ${tab === 'history' ? 'border-t-2 border-amber-500 text-amber-600' : 'text-gray-400'}`}
        >
          歷史紀錄
        </button>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50" onClick={() => setShowCheckout(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[95vh] overflow-y-auto rounded-t-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <CheckoutFlow onClose={() => setShowCheckout(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
