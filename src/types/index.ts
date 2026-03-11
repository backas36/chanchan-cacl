export interface CartItem {
  price: number;
  quantity: number;
  isCustom?: boolean;
}

export interface Transaction {
  id: string;
  timestamp: string; // ISO 8601
  items: CartItem[];
  subtotal: number;
  discount: number; // 負數為折扣
  total: number;
  received: number;
  change: number;
}

export interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  transactions: Transaction[];
  sessionTotal: number;
}
