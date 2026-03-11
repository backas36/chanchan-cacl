import { useCartStore } from '@/stores/useCartStore';
import { useSessionStore } from '@/stores/useSessionStore';
import itemData from '@/data/itemData.json';

const priceToLabel: Record<number, string> = Object.fromEntries(itemData.items.map((item) => [item.price, item.label]));

interface CartProps {
  onCheckout: () => void;
}

export function Cart({ onCheckout }: CartProps) {
  const { items, subtotal, removeItem, clearCart } = useCartStore();
  const activeSession = useSessionStore((s) => s.activeSession);
  const isEmpty = items.length === 0;

  return (
    <div className='flex flex-col gap-2'>
      <div className='mt-4 flex gap-2'>
        <button
          onClick={clearCart}
          className='flex-1 rounded-xl bg-gray-200 p-3 font-bold disabled:opacity-40'
          disabled={isEmpty || !activeSession}
        >
          清空
        </button>
        <button
          onClick={onCheckout}
          disabled={isEmpty || !activeSession}
          className='bg-brand flex-2 rounded-xl p-3 font-bold text-white disabled:opacity-40'
        >
          結帳
        </button>
      </div>
      {isEmpty ? (
        <p className='text-sage py-4 text-center'>購物車空的</p>
      ) : (
        <ul className='space-y-1'>
          {items.map((item) => (
            <li
              key={`${item.price}-${item.isCustom ? 'custom' : 'catalog'}`}
              className='bg-cream-light flex items-center gap-2 rounded-lg p-2'
            >
              <span className='flex-1 font-bold'>{item.isCustom ? '自訂' : (priceToLabel[item.price] ?? '自訂')}</span>
              <span className='text-sage w-10 text-center'>x{item.quantity}</span>
              <span className='w-16 text-right text-sm font-medium'>${item.price * item.quantity}</span>
              <button
                onClick={() => removeItem(item.price, item.isCustom)}
                className='ml-2 rounded-xl bg-red-100 px-3 py-0.5 font-bold text-red-600'
                aria-label='-'
              >
                -
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className='flex items-center justify-between border-t pt-2'>
        <span className='text-gray-600'>小計</span>
        <span className='text-xl font-bold'>${subtotal}</span>
      </div>
    </div>
  );
}
