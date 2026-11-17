/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { TopBar } from './components/TopBar';
import { BlueprintSandbox } from './components/BlueprintSandbox';
import { SelfLifecycleStepper } from './components/SelfLifecycleStepper';
import { OopPillarsExplorer } from './components/OopPillarsExplorer';
import { ConceptQuiz } from './components/ConceptQuiz';

export default function App() {
  const [resetSignal, setResetSignal] = useState(0);

  const handleResetLab = () => {
    setResetSignal((s) => s + 1);
    const el = document.getElementById('sandbox');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopBar onResetLab={handleResetLab} />

      <main>
        <BlueprintSandbox resetSignal={resetSignal} />
        <SelfLifecycleStepper />
        <OopPillarsExplorer />
        <ConceptQuiz />
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 px-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>PyCraft 物件工坊 · Python 類別與物件互動教學實驗室</span>
          <div className="flex items-center gap-5">
            <a href="#sandbox" className="hover:text-slate-900">
              藍圖與實例
            </a>
            <a href="#lifecycle" className="hover:text-slate-900">
              self 追蹤器
            </a>
            <a href="#pillars" className="hover:text-slate-900">
              進階支柱
            </a>
            <a href="#quiz" className="hover:text-slate-900">
              觀念測驗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
