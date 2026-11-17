import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/pythonOopData';
import { PythonSyntaxText } from './PythonSyntaxText';

export const ConceptQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const question = QUIZ_QUESTIONS[currentIdx];
  const selectedOption = answers[question.id];
  const hasAnswered = selectedOption !== undefined;
  const isCorrect = selectedOption === question.correctIndex;

  const answeredCount = Object.keys(answers).length;
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;

  const handleSelectOption = (optIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: optIndex,
    }));
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setCurrentIdx(0);
  };

  return (
    <section id="quiz" className="border-t border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-medium tracking-wide text-sky-700">
              04. 觀念實戰檢測 · 除錯與陷阱判讀
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
              五道高頻 Python 物件導向除錯挑戰
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              測驗自己是否能避開 <code className="font-mono">self</code> 遺漏、可變類別屬性共用與屬性遮蔽等常見開發陷阱。
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="tabular-nums">
              作答進度：<strong className="text-slate-900">{answeredCount} / {QUIZ_QUESTIONS.length}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">|</span>
            <span className="tabular-nums">
              目前答對：<strong className="text-emerald-700">{correctCount} 題</strong>
            </span>
            <button
              type="button"
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 transition-colors hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              重新作答
            </button>
          </div>
        </div>

        {/* Question Stepper Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const ans = answers[q.id];
            const active = idx === currentIdx;
            const answered = ans !== undefined;
            const qCorrect = ans === q.correctIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'border-sky-600 bg-sky-50 text-sky-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="tabular-nums">第 {q.id} 題</span>
                <span className="text-slate-400" aria-hidden="true">·</span>
                <span>{q.topic}</span>
                {answered && (
                  qCorrect ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" aria-label="答對" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-rose-700" aria-label="答錯" />
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Main Quiz Card */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Code Prompt */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 lg:col-span-6">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                題目 {question.id} · {question.topic}
              </span>
              <span className="text-slate-500">請判讀執行結果</span>
            </div>
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              {question.question}
            </h3>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 font-mono text-[13px] leading-6">
              {question.code.split('\n').map((line, i) => (
                <div key={i} className="whitespace-pre">
                  <PythonSyntaxText line={line} />
                </div>
              ))}
            </div>

            {hasAnswered && question.fixedCode && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
                <div className="mb-2 text-xs font-semibold text-emerald-900">
                  建議修正寫法
                </div>
                <div className="overflow-x-auto font-mono text-[13px] leading-6">
                  {question.fixedCode.split('\n').map((line, i) => (
                    <div key={i} className="whitespace-pre">
                      <PythonSyntaxText line={line} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Options & Feedback */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-6">
            <div className="mb-3 text-xs font-semibold text-slate-700">選擇一個答案</div>
            <div className="space-y-2.5">
              {question.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isAnswer = idx === question.correctIndex;

                let styleClass =
                  'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50';
                if (hasAnswered) {
                  if (isAnswer) {
                    styleClass = 'border-emerald-600 bg-emerald-50/80 text-emerald-950';
                  } else if (isSelected && !isAnswer) {
                    styleClass = 'border-rose-500 bg-rose-50/80 text-rose-950';
                  } else {
                    styleClass = 'border-slate-200 bg-slate-50/40 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`flex w-full items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all cursor-pointer ${styleClass}`}
                  >
                    <span className="leading-relaxed">
                      <span className="mr-2 font-mono text-xs font-bold text-slate-500">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {option}
                    </span>

                    {hasAnswered && isAnswer && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 whitespace-nowrap shrink-0">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        正解
                      </span>
                    )}
                    {hasAnswered && isSelected && !isAnswer && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 whitespace-nowrap shrink-0">
                        <XCircle className="h-4 w-4" aria-hidden="true" />
                        誤選
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <div
                className={`mt-4 rounded-xl border p-4 text-xs leading-relaxed ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/60 text-emerald-950'
                    : 'border-amber-200 bg-amber-50/60 text-amber-950'
                }`}
              >
                <div className="mb-1 flex items-center gap-1.5 font-semibold">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                      <span>觀念正確！</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-700" aria-hidden="true" />
                      <span>再檢查一下觀念解析：</span>
                    </>
                  )}
                </div>
                <p>{question.explanation}</p>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                上一題
              </button>

              <button
                type="button"
                disabled={currentIdx === QUIZ_QUESTIONS.length - 1}
                onClick={() => setCurrentIdx((i) => Math.min(QUIZ_QUESTIONS.length - 1, i + 1))}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                下一題
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
