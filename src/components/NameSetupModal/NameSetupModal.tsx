import { useState } from 'react';

interface NameSetupModalProps {
  onSave: (name: string) => void;
}

export function NameSetupModal({ onSave }: NameSetupModalProps) {
  const [name, setName] = useState('');

  const handleConfirm = () => {
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-80 rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-center text-xl font-bold">歡迎使用收銀機</h2>
        <p className="mb-4 text-center text-gray-500 text-sm">請輸入你的名字</p>
        <input
          type="text"
          placeholder="你的名字"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          className="mb-4 w-full rounded-lg border-2 p-3 text-center text-lg"
          autoFocus
        />
        <button
          onClick={handleConfirm}
          className="w-full rounded-xl bg-brand p-3 font-bold text-lg text-white"
        >
          確認
        </button>
      </div>
    </div>
  );
}
