import { useState } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import itemData from '@/data/itemData.json';

export function PriceGrid() {
  const addItem = useCartStore((s) => s.addItem);
  const [showCustom, setShowCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const handleConfirmCustom = () => {
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      addItem(amount);
      setCustomAmount('');
      setShowCustom(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {itemData.items.map((item) => (
          <button
            key={item.price}
            onClick={() => addItem(item.price)}
            className="flex h-24 flex-col items-center justify-between rounded-xl bg-amber-100 p-3 active:bg-amber-300"
          >
            <span className="text-sm font-bold leading-tight">{item.label}</span>
            {item.variants.length > 0 && (
              <span className="text-xs text-amber-700 leading-tight">
                {item.variants.join('/')}
              </span>
            )}
            <span className="text-lg font-bold mt-1">${item.price}</span>
          </button>
        ))}
        <button
          onClick={() => setShowCustom(true)}
          className="h-24 rounded-xl bg-gray-100 p-3 text-lg font-bold active:bg-gray-300"
        >
          自訂
        </button>
      </div>

      {showCustom && (
        <div className="mt-2 flex gap-2">
          <input
            type="number"
            placeholder="金額"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1 rounded border p-2"
            autoFocus
          />
          <button
            onClick={handleConfirmCustom}
            className="rounded bg-amber-400 px-4 py-2 font-bold"
          >
            確認
          </button>
          <button
            onClick={() => {
              setShowCustom(false);
              setCustomAmount('');
            }}
            className="rounded bg-gray-200 px-4 py-2"
          >
            取消
          </button>
        </div>
      )}
    </div>
  );
}
