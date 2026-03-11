import { useCartStore } from '@/stores/useCartStore';
import itemData from '@/data/itemData.json';

const priceToLabel: Record<number, string> = Object.fromEntries(itemData.items.map((item) => [item.price, item.label]));

interface CartProps {
  onCheckout: () => void;
}

export function Cart({ onCheckout }: CartProps) {
  const { items, subtotal, removeItem, clearCart } = useCartStore();
  const isEmpty = items.length === 0;

  return (
    <div className='flex flex-col gap-2'>
      {isEmpty ? (
        <p className='py-4 text-center text-gray-400'>購物車空的</p>
      ) : (
        <ul className='space-y-1'>
          {items.map((item) => (
            <li key={item.price} className='flex items-center gap-2 rounded-lg bg-white p-2'>
              <span className='flex-1 font-bold'>{priceToLabel[item.price] ?? '自訂'}</span>
              <span className='w-10 text-center text-gray-500'>x{item.quantity}</span>
              <span className='w-16 text-right text-sm font-medium'>${item.price * item.quantity}</span>
              <button
                onClick={() => removeItem(item.price)}
                className='ml-2 rounded-2xl bg-red-100 px-2 py-0.5 font-bold text-red-600'
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

      <div className='flex gap-2'>
        <button
          onClick={clearCart}
          className='flex-1 rounded-xl bg-gray-200 p-3 font-bold disabled:opacity-40'
          disabled={isEmpty}
        >
          清空
        </button>
        <button
          onClick={onCheckout}
          disabled={isEmpty}
          className='flex-2 rounded-xl bg-amber-400 p-3 font-bold disabled:opacity-40'
        >
          結帳
        </button>
      </div>
    </div>
  );
}
