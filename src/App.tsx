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
  const { sessions, activeSession, resetAll } = useSessionStore();

  const handleResetAll = () => {
    resetAll();
    setUserName('');
  };

  if (!userName) {
    return <NameSetupModal onSave={setUserName} />;
  }

  const handleReset = () => {
    if (window.confirm('⚠️ 確定要重置所有資料嗎？這會刪除你的名字、場次、業績紀錄，且不可復原！')) {
      if (window.confirm('🔥 真的確定？這是最後一次確認！所有紀錄都會消失！')) {
        handleResetAll();
      }
    }
  };

  return (
    <div className='bg-cream flex h-dvh flex-col'>
      {/* Header — 固定置頂 */}
      <div className='shrink-0 px-3 py-0'>
        <SessionPanel userName={userName} />
      </div>

      {/* Content — 剩餘空間，捲軸在這層 */}
      <div className='relative flex-1 overflow-y-auto p-3'>
        {tab === 'calculator' ? (
          <>
            <div className='space-y-3'>
              <Cart onCheckout={() => setShowCheckout(true)} />
              <PriceGrid />
            </div>
            {!activeSession && (
              <div className='bg-cream/80 absolute inset-0 flex flex-col items-center justify-center gap-4 backdrop-blur-sm'>
                <p className='text-lg font-bold text-gray-600'>還沒開始場次</p>
                <p className='text-sm text-gray-400'>請按上方「開始場次」來開始收銀</p>
              </div>
            )}
          </>
        ) : (
          <TransactionHistory sessions={sessions} activeSession={activeSession} userName={userName} />
        )}
      </div>
      {/* 隱藏的重置按鈕 */}
      {tab === 'history' && (
        <button
          onClick={handleReset}
          className='absolute bottom-[6dvh] rounded-lg border border-red-50 px-2 py-1 text-[10px] font-medium text-red-300 active:bg-red-50'
        >
          重置全部資料
        </button>
      )}
      {/* Bottom Tabs — 固定置底 */}
      <div className='flex shrink-0 border-t bg-white'>
        <button
          onClick={() => setTab('calculator')}
          className={`flex-1 py-3 text-sm font-medium ${tab === 'calculator' ? 'border-brand text-brand border-t-2' : 'text-gray-400'}`}
        >
          收銀機
        </button>
        <button
          onClick={() => setTab('history')}
          className={`flex-1 py-3 text-sm font-medium ${tab === 'history' ? 'border-brand text-brand border-t-2' : 'text-gray-400'}`}
        >
          歷史紀錄
        </button>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className='fixed inset-0 bg-black/50' onClick={() => setShowCheckout(false)}>
          <div
            className='absolute right-0 bottom-0 left-0 max-h-[95vh] overflow-y-auto rounded-t-2xl bg-white'
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
