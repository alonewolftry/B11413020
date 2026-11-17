import React from 'react';

interface TopBarProps {
  onResetLab: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onResetLab }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-6 py-3.5">
        <a
          href="#sandbox"
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          PyCraft 物件工坊
        </a>

        <nav
          aria-label="主要導覽"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <a
            href="#sandbox"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 hover:underline underline-offset-4"
          >
            藍圖與實例
          </a>
          <a
            href="#lifecycle"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 hover:underline underline-offset-4"
          >
            self 追蹤器
          </a>
          <a
            href="#pillars"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 hover:underline underline-offset-4"
          >
            進階支柱
          </a>
          <a
            href="#quiz"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 hover:underline underline-offset-4"
          >
            觀念測驗
          </a>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onResetLab}
            className="rounded-lg bg-sky-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 whitespace-nowrap shrink-0 cursor-pointer"
          >
            重設實驗室
          </button>
        </div>
      </div>
    </header>
  );
};
