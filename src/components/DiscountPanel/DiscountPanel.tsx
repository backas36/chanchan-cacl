import { useState } from 'react';

interface DiscountPanelProps {
  discount: number;
  onDiscountChange: (value: number) => void;
}

const QUICK_DISCOUNTS = [-50, -20, -10, +10, +20, +50];

export function DiscountPanel({ discount, onDiscountChange }: DiscountPanelProps) {
  const [customInput, setCustomInput] = useState('');

  const handleQuick = (delta: number) => {
    onDiscountChange(discount + delta);
  };

  const handleCustomSubmit = () => {
    const val = parseInt(customInput, 10);
    if (!isNaN(val)) {
      onDiscountChange(val);
      setCustomInput('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-sage">折扣</span>
        <span className="font-bold text-red-500">{discount}</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {QUICK_DISCOUNTS.map((d) => (
          <button
            key={d}
            onClick={() => handleQuick(d)}
            className={`rounded-lg p-2 font-bold ${d < 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
          >
            {d > 0 ? `+${d}` : `${d}`}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="自訂折扣"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
          className="flex-1 rounded border p-2 text-sm"
        />
        <button onClick={handleCustomSubmit} className="rounded bg-gray-200 px-3 py-2 text-sm">
          套用
        </button>
      </div>
    </div>
  );
}
