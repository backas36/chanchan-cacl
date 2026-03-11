import { useState } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { DiscountPanel } from '@/components/DiscountPanel/DiscountPanel';
import { ChangeCalculator } from '@/components/ChangeCalculator/ChangeCalculator';

interface CheckoutFlowProps {
  onClose: () => void;
}

export function CheckoutFlow({ onClose }: CheckoutFlowProps) {
  const { items, subtotal, clearCart } = useCartStore();
  const { addTransaction } = useSessionStore();
  const [discount, setDiscount] = useState(0);
  const [received, setReceived] = useState(0);

  const total = subtotal + discount;
  const change = received - total;

  const handleComplete = () => {
    addTransaction({
      items,
      subtotal,
      discount,
      total,
      received,
      change,
    });
    clearCart();
    onClose();
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-bold">結帳</h2>

      <div className="flex justify-between text-gray-600">
        <span>小計</span>
        <span className="font-bold">${subtotal}</span>
      </div>

      <DiscountPanel discount={discount} onDiscountChange={setDiscount} />

      <div className="flex justify-between font-bold">
        <span>折後總計</span>
        <span className="text-xl">${total}</span>
      </div>

      <ChangeCalculator total={total} received={received} onReceivedChange={setReceived} />

      <button
        onClick={handleComplete}
        className="w-full rounded-xl bg-green-500 p-4 text-lg font-bold text-white"
      >
        完成
      </button>
    </div>
  );
}
