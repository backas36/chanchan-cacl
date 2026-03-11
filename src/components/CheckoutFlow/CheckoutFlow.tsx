import { useState } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { ChangeCalculator } from '@/components/ChangeCalculator/ChangeCalculator';
import itemData from '@/data/itemData.json';

const priceToLabel: Record<number, string> = Object.fromEntries(itemData.items.map((item) => [item.price, item.label]));

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
    <div className='space-y-4 p-4'>
      <h2 className='text-lg font-bold'>結帳</h2>

      {/* 品項明細 */}
      <div className='bg-cream space-y-1 rounded-xl p-3'>
        {items.map((item) => {
          const label = item.isCustom ? '自訂' : (priceToLabel[item.price] ?? '自訂');
          return (
            <div key={`${item.price}-${item.isCustom ? 'custom' : 'catalog'}`} className='flex justify-between text-sm'>
              <span>{label}</span>
              <span className='text-gray-500'>x{item.quantity}</span>
              <span>${item.price * item.quantity}</span>
            </div>
          );
        })}
      </div>

      {/* 折扣 */}
      <div className='flex items-center justify-between'>
        <div className='flex gap-2'>
          <button
            onClick={() => setDiscount((d) => d - 10)}
            className='rounded-lg bg-red-100 px-6 py-1 font-bold text-red-700'
          >
            -10
          </button>
          <button
            onClick={() => setDiscount((d) => d + 10)}
            className='rounded-lg bg-green-100 px-6 py-1 font-bold text-green-700'
          >
            +10
          </button>
        </div>
        {discount !== 0 && <span className='text-sm text-red-500'>折扣 {discount}</span>}
      </div>

      <div className='flex justify-between font-bold'>
        <span>總計</span>
        <span className='text-xl'>${total}</span>
      </div>

      <ChangeCalculator total={total} received={received} onReceivedChange={setReceived} />

      <button onClick={handleComplete} className='bg-brand w-full rounded-xl p-4 text-lg font-bold text-white'>
        完成
      </button>
    </div>
  );
}
