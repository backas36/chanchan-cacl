# chan-calc 收銀機 Web App — Spec Context

> 朋友擺攤用的行動收銀機，3-4 人各自使用手機，老板娘手動加總。
> 純前端，localStorage 儲存，不需後端。

---

## Tech Stack

| 工具 | 版本 |
|------|------|
| React | 19 |
| TypeScript | ~5.9 |
| Vite | 7 |
| Tailwind CSS | 4 |
| Zustand | 5 |
| Vitest + Testing Library | 4 |

---

## 功能需求

| 功能 | 說明 |
|------|------|
| 姓名設定 | 首次開啟輸入名稱，存 localStorage（`cc_user_name`） |
| 快速價格按鈕 | 60, 80, 50, 100, 160, 180, 200（來自 `src/data/itemData.json`） |
| 購物車 | 顯示已選品項 + 數量 badge，可單品 -1 / 全清 |
| 折扣調整 | -50/-20/-10/+10/+20/+50 快速按鈕 + 自訂輸入（Enter 套用） |
| 自訂金額 | 輸入任意金額加入購物車 |
| 找零計算 | 輸入收款金額 → 自動顯示找零 |
| 結帳完成 | 儲存交易紀錄到 Zustand（activeSession），清空購物車 |
| 手動場次管理 | 開始新場次 / 結束場次 |
| 交易紀錄 | 每筆含時間、品項、折扣、實收 |
| 複製總結 | 「{姓名} 今天賺了 ${total} 元」複製到剪貼簿 |

---

## 資料結構

```typescript
// src/types/index.ts

interface CartItem {
  price: number;
  quantity: number;
}

interface Transaction {
  id: string;
  timestamp: string;       // ISO 8601
  items: CartItem[];
  subtotal: number;
  discount: number;        // 負數為折扣，正數為加價
  total: number;           // subtotal + discount
  received: number;
  change: number;          // received - total
}

interface Session {
  id: string;
  startTime: string;       // ISO 8601
  endTime?: string;
  transactions: Transaction[];
  sessionTotal: number;    // 累計所有 tx.total
}
```

---

## localStorage Keys

| Key | 型別 | 說明 |
|-----|------|------|
| `cc_user_name` | `string` | 使用者名稱（useLocalStorage hook 管理） |

> **注意**：sessions 目前存在 Zustand memory，未接 persist middleware。
> 若需重整後保留歷史，需加 `zustand/middleware` 的 `persist`。

---

## 檔案結構

```
src/
├── types/index.ts
├── data/itemData.json              { "price": ["60","80","50","100","160","180","200"] }
├── stores/
│   ├── useCartStore.ts             addItem / removeItem / clearCart / subtotal
│   └── useSessionStore.ts          startSession / endSession / addTransaction / resetAll
├── hooks/
│   └── useLocalStorage.ts          泛型 hook，讀寫 localStorage
├── components/
│   ├── NameSetupModal/             首次進入設定名稱，onSave(name)
│   ├── PriceGrid/                  價格按鈕格 + 自訂金額 input
│   ├── Cart/                       購物車清單，props: onCheckout
│   ├── DiscountPanel/              折扣面板，props: discount / onDiscountChange
│   ├── ChangeCalculator/           找零計算，props: total / received / onReceivedChange
│   ├── CheckoutFlow/               結帳流程（bottom sheet），props: onClose
│   ├── SessionPanel/               場次控制 + 顯示 sessionTotal + 複製按鈕
│   └── TransactionHistory/         歷史紀錄按場次分組，props: sessions / activeSession / userName
├── test/setup.ts                   localStorage mock + clipboard mock + beforeEach clear
└── App.tsx                         整合，底部 tab（收銀機 / 歷史紀錄）+ checkout modal
```

---

## 畫面流程

### 主畫面（收銀機 tab）
```
┌─────────────────────────────┐
│  SessionPanel               │  ← 姓名 + 場次總額 + 開始/結束/複製
├─────────────────────────────┤
│  Cart                       │  ← 品項列表 + 小計 + 清空 + 結帳按鈕
├─────────────────────────────┤
│  PriceGrid                  │  ← 7 個價格按鈕 + 自訂金額
└─────────────────────────────┘
```

### 結帳流程（bottom sheet modal）
```
CheckoutFlow
  1. 顯示小計
  2. DiscountPanel（折扣快速鈕 + 自訂）
  3. 顯示折後總計
  4. ChangeCalculator（輸入收款 → 找零）
  5. 「完成」→ addTransaction → clearCart → onClose
```

### 歷史紀錄 tab
```
TransactionHistory
  ├── Session 1
  │   ├── 每筆 tx：時間 + 折扣 + 金額
  │   └── [複製結果] → "{userName} {日期} 賺了 ${sessionTotal} 元"
  └── Session 2...
```

---

## 元件 Props 契約

```typescript
<NameSetupModal onSave={(name: string) => void} />
<SessionPanel userName={string} />
<Cart onCheckout={() => void} />
<DiscountPanel discount={number} onDiscountChange={(v: number) => void} />
<ChangeCalculator total={number} received={number} onReceivedChange={(v: number) => void} />
<CheckoutFlow onClose={() => void} />
<TransactionHistory sessions={Session[]} activeSession={Session | null} userName={string} />
```

---

## 測試指令

```bash
npx vitest run        # 執行所有測試（非 pnpm test --run）
npx vitest            # watch mode
npx vite              # 本地開發
```

> 目前 63 tests / 11 test files，全通過。

---

## 已知限制 / 未來可擴充

- [ ] sessions 頁面重整後消失（需加 Zustand persist）
- [ ] 無網路同步（純本機）
- [ ] 無多人合併總計功能
- [ ] itemData.json 價格需手動修改檔案才能更改
