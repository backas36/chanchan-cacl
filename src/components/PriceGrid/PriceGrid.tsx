import { useState } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useSessionStore } from '@/stores/useSessionStore';
import itemData from '@/data/itemData.json';

export function PriceGrid() {
  const addItem = useCartStore((s) => s.addItem);
  const activeSession = useSessionStore((s) => s.activeSession);
  const disabled = !activeSession;
  const [showCustom, setShowCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const handleConfirmCustom = () => {
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      addItem(amount, true);
      setCustomAmount('');
      setShowCustom(false);
    }
  };

  return (
    <div className='mt-4'>
      <div className='grid grid-cols-3 gap-x-2 gap-y-6'>
        {itemData.items.map((item) => (
          <button
            key={item.price}
            onClick={() => addItem(item.price)}
            disabled={disabled}
            className='border-brand/20 bg-cream active:bg-brand-light flex h-34 flex-col items-center justify-between rounded-xl border p-3 shadow-sm active:text-white disabled:opacity-40'
          >
            <span className='text-2xl leading-tight font-bold'>{item.label}</span>
            {item.variants.length > 0 && (
              <span className='text-brand text-xl leading-tight'>{item.variants.join('/')}</span>
            )}
            <span className='mt-1 text-xl font-bold'>${item.price}</span>
          </button>
        ))}
        <button
          onClick={() => setShowCustom(true)}
          disabled={disabled}
          className='h-34 rounded-xl border border-gray-300 bg-gray-100 p-3 text-lg font-bold shadow-sm active:bg-gray-300 disabled:opacity-40'
        >
          自訂
        </button>
      </div>

      {showCustom && (
        <div className='mt-2 flex gap-2'>
          <input
            type='number'
            placeholder='金額'
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className='flex-1 rounded border bg-white p-2'
            autoFocus
          />
          <button onClick={handleConfirmCustom} className='bg-brand rounded px-4 py-2 font-bold text-white'>
            確認
          </button>
          <button
            onClick={() => {
              setShowCustom(false);
              setCustomAmount('');
            }}
            className='rounded bg-gray-200 px-4 py-2'
          >
            取消
          </button>
        </div>
      )}
    </div>
  );
}
