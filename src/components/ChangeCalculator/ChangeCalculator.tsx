interface ChangeCalculatorProps {
  total: number;
  received: number;
  onReceivedChange: (value: number) => void;
}

export function ChangeCalculator({ total, received, onReceivedChange }: ChangeCalculatorProps) {
  const change = received - total;

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">應收</span>
        <span className="text-xl font-bold">${total}</span>
      </div>

      <div>
        <input
          type="number"
          placeholder="收款金額"
          value={received || ''}
          onChange={(e) => onReceivedChange(parseInt(e.target.value, 10) || 0)}
          className="w-full rounded-lg border-2 p-3 text-right text-xl"
        />
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">找零</span>
        <span className={`text-xl font-bold ${change < 0 ? 'text-red-500' : 'text-green-600'}`}>
          ${change}
        </span>
      </div>
    </div>
  );
}
