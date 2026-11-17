import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, ArrowRight } from 'lucide-react';
import { LIFECYCLE_CODE, LIFECYCLE_STEPS } from '../data/pythonOopData';
import { PythonSyntaxText } from './PythonSyntaxText';

export const SelfLifecycleStepper: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStep = LIFECYCLE_STEPS[stepIndex];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= LIFECYCLE_STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  return (
    <section
      id="lifecycle"
      className="border-t border-slate-200 bg-white py-14"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-medium tracking-wide text-sky-700">
              02. 步驟追蹤器 · self 綁定機制
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
              看懂 <code className="font-mono text-amber-700">self</code> 究竟指向誰：物件誕生與方法呼叫的五個瞬間
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              按下「下一步」或「自動播放」，追蹤 Python 在建立實例與呼叫方法時，如何在背景自動傳遞記憶體位址給 <code className="font-mono text-slate-800">self</code>。
            </p>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => {
                setIsPlaying(false);
                setStepIndex((s) => Math.max(0, s - 1));
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              上一步
            </button>

            <button
              type="button"
              onClick={() => {
                if (stepIndex === LIFECYCLE_STEPS.length - 1 && !isPlaying) {
                  setStepIndex(0);
                }
                setIsPlaying((p) => !p);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                  暫停播放
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  自動播放
                </>
              )}
            </button>

            <button
              type="button"
              disabled={stepIndex === LIFECYCLE_STEPS.length - 1}
              onClick={() => {
                setIsPlaying(false);
                setStepIndex((s) => Math.min(LIFECYCLE_STEPS.length - 1, s + 1));
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              下一步
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIndex(0);
              }}
              aria-label="重設追蹤步驟"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              重設
            </button>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {LIFECYCLE_STEPS.map((st, idx) => {
            const active = idx === stepIndex;
            return (
              <button
                key={st.step}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setStepIndex(idx);
                }}
                className={`rounded-lg border px-3 py-2.5 text-left transition-all cursor-pointer ${
                  active
                    ? 'border-sky-600 bg-sky-50 text-sky-900'
                    : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-[11px] font-medium text-slate-500 tabular-nums">
                  步驟 0{st.step}
                </div>
                <div className="mt-0.5 truncate text-xs font-semibold">{st.title}</div>
              </button>
            );
          })}
        </div>

        {/* Execution Stage */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          {/* Code View */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 lg:col-span-5">
            <div>
              <div className="border-b border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700">
                執行追蹤程式碼 (第 {currentStep.activeLine} 行作用中)
              </div>
              <div className="py-3 font-mono text-[13px] leading-7 overflow-x-auto">
                {LIFECYCLE_CODE.map((line, i) => {
                  const lineNo = i + 1;
                  const isLineActive = lineNo === currentStep.activeLine;
                  return (
                    <div
                      key={lineNo}
                      className={`flex items-center gap-4 px-4 transition-colors ${
                        isLineActive ? 'bg-amber-100/70' : ''
                      }`}
                    >
                      <span
                        className={`w-5 shrink-0 text-right text-xs tabular-nums ${
                          isLineActive ? 'font-bold text-amber-800' : 'text-slate-400'
                        }`}
                      >
                        {lineNo}
                      </span>
                      <span className="whitespace-pre">
                        <PythonSyntaxText line={line} />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-900">{currentStep.summary}</div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{currentStep.detail}</p>
            </div>
          </div>

          {/* Memory Diagram View */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-6 lg:col-span-7 flex flex-col justify-between">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Stack / Variable References */}
              <div>
                <div className="mb-3 text-xs font-semibold text-slate-700">
                  名稱空間與參數 (Stack / Scope)
                </div>
                <div className="space-y-3">
                  {currentStep.stackVars.map((sv) => {
                    const isSelf = sv.name.startsWith('self');
                    return (
                      <div
                        key={sv.name}
                        className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                          isSelf
                            ? 'border-amber-400 bg-amber-50/70'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div>
                          <div className="font-mono text-xs font-bold text-slate-900">
                            {sv.name}
                          </div>
                          <div className="text-[11px] text-slate-500">{sv.note}</div>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-sky-700 tabular-nums">
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                          <span>{sv.targetAddr}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Heap Objects */}
              <div>
                <div className="mb-3 text-xs font-semibold text-slate-700">
                  物件記憶體區 (Heap Memory)
                </div>
                {currentStep.heapObjects.length === 0 ? (
                  <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/70 p-4 text-center text-xs text-slate-500">
                    尚未呼叫 Dog(&quot;阿柴&quot;, 3)，目前記憶體中沒有任何 Dog 實例物件。
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentStep.heapObjects.map((obj) => (
                      <div
                        key={obj.addr}
                        className={`rounded-xl border bg-white p-4 transition-all ${
                          currentStep.selfPointsTo === obj.addr
                            ? 'border-amber-500 ring-1 ring-amber-400'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                            記憶體 {obj.addr}
                          </span>
                          <span className="text-xs font-medium text-sky-700">{obj.typeName}</span>
                        </div>

                        {currentStep.selfPointsTo === obj.addr && (
                          <div className="mb-2.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-900">
                            self 正在綁定此物件 ({obj.addr})
                          </div>
                        )}

                        {obj.dict.length === 0 ? (
                          <p className="font-mono text-xs text-slate-400">
                            __dict__ = &#123;&#125; (剛配置完成，等待寫入屬性)
                          </p>
                        ) : (
                          <div className="space-y-1.5 font-mono text-xs">
                            <div className="text-[11px] text-slate-400">__dict__ 實例屬性表：</div>
                            {obj.dict.map((entry) => (
                              <div
                                key={entry.key}
                                className={`flex items-center justify-between rounded px-2 py-1 ${
                                  obj.highlightKey === entry.key
                                    ? 'bg-sky-50 font-semibold text-sky-900'
                                    : 'text-slate-700'
                                }`}
                              >
                                <span>&quot;{entry.key}&quot;</span>
                                <span>{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
              關鍵結論：<code className="font-mono font-semibold text-slate-800">self</code> 不是保留字，而是一個「約定俗成的參數名稱」。當你寫 <code className="font-mono text-sky-700">dog.bark()</code> 時，Python 會自動把它翻譯成 <code className="font-mono text-sky-700">Dog.bark(dog)</code>。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
