import React, { useState } from 'react';
import { GitBranch, ShieldCheck, Sparkles, Play, CheckCircle2, XCircle } from 'lucide-react';
import { INHERITANCE_NODES, InheritanceNode } from '../data/pythonOopData';
import { PythonSyntaxText } from './PythonSyntaxText';

type PillarTab = 'inheritance' | 'encapsulation' | 'dunder';

export const OopPillarsExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PillarTab>('inheritance');

  // Inheritance state
  const [selectedClassId, setSelectedClassId] = useState<InheritanceNode['id']>('GuideDog');
  const [polyRunCount, setPolyRunCount] = useState(0);

  // Encapsulation state
  const [rawAmountInput, setRawAmountInput] = useState('-500');
  const [publicBalance, setPublicBalance] = useState(1000);
  const [protectedBalance, setProtectedBalance] = useState(1000);
  const [setterStatus, setSetterStatus] = useState<{
    ok: boolean;
    message: string;
  }>({
    ok: true,
    message: '目前餘額為 1000 元，嘗試輸入負數測試 @property 防護機制。',
  });

  // Dunder state
  const [enableStr, setEnableStr] = useState(true);
  const [enableEq, setEnableEq] = useState(true);
  const [enableLen, setEnableLen] = useState(true);

  const selectedNode =
    INHERITANCE_NODES.find((n) => n.id === selectedClassId) ?? INHERITANCE_NODES[0];

  const handleTestEncapsulation = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(rawAmountInput);
    if (Number.isNaN(num)) {
      setSetterStatus({
        ok: false,
        message: 'ValueError：請輸入有效的整數數值。',
      });
      return;
    }

    // Public attribute lets anything overwrite it
    setPublicBalance(num);

    // @property setter validates
    if (num < 0) {
      setSetterStatus({
        ok: false,
        message: `ValueError 攔截！@balance.setter 拒絕負數 (${num})，受保護餘額維持 ${protectedBalance}。`,
      });
    } else {
      setProtectedBalance(num);
      setSetterStatus({
        ok: true,
        message: `驗證通過：@balance.setter 已安全更新 _Account__balance = ${num}。`,
      });
    }
  };

  return (
    <section id="pillars" className="border-t border-slate-200 bg-slate-50 py-14">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-medium tracking-wide text-sky-700">
              03. 進階核心支柱 · 結構化與重用
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
              掌握繼承、多型、封裝保護與魔術方法
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              當專案規模變大，物件導向透過這三項核心機制減少重複程式碼、保護資料安全並讓自訂類別融入 Python 語法。
            </p>
          </div>

          <div
            role="tablist"
            aria-label="選擇 OOP 進階主題"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 self-start lg:self-auto"
          >
            <button
              role="tab"
              type="button"
              aria-selected={activeTab === 'inheritance'}
              onClick={() => setActiveTab('inheritance')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'inheritance'
                  ? 'bg-sky-700 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
              繼承與多型
            </button>
            <button
              role="tab"
              type="button"
              aria-selected={activeTab === 'encapsulation'}
              onClick={() => setActiveTab('encapsulation')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'encapsulation'
                  ? 'bg-sky-700 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              封裝與 @property
            </button>
            <button
              role="tab"
              type="button"
              aria-selected={activeTab === 'dunder'}
              onClick={() => setActiveTab('dunder')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'dunder'
                  ? 'bg-sky-700 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              魔術方法
            </button>
          </div>
        </div>

        {/* Tab 1: Inheritance & Polymorphism */}
        {activeTab === 'inheritance' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            {/* Hierarchy Tree & Polymorphism Runner */}
            <div className="space-y-6 lg:col-span-6">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    類別繼承樹（點擊節點檢視方法解析順序 MRO）
                  </h3>
                  <span className="text-xs text-slate-500">4 個關聯類別</span>
                </div>

                {/* Visual Hierarchy */}
                <div className="space-y-3">
                  {/* Root: Animal */}
                  <button
                    type="button"
                    onClick={() => setSelectedClassId('Animal')}
                    className={`w-full rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                      selectedClassId === 'Animal'
                        ? 'border-sky-600 bg-sky-50/70 ring-1 ring-sky-600'
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-slate-900">class Animal</span>
                      <span className="text-xs text-slate-500">基底類別 (Parent)</span>
                    </div>
                  </button>

                  {/* Children row */}
                  <div className="grid grid-cols-1 gap-3 pl-4 sm:grid-cols-2 sm:pl-6">
                    {(['Dog', 'Cat'] as const).map((cid) => {
                      const node = INHERITANCE_NODES.find((n) => n.id === cid)!;
                      const active = selectedClassId === cid;
                      return (
                        <button
                          key={cid}
                          type="button"
                          onClick={() => setSelectedClassId(cid)}
                          className={`rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                            active
                              ? 'border-sky-600 bg-sky-50/70 ring-1 ring-sky-600'
                              : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-mono text-sm font-bold text-slate-900">
                            {node.name}
                          </div>
                          <div className="mt-0.5 text-xs text-slate-500">{node.roleLabel}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Grandchild: GuideDog */}
                  <div className="pl-8 sm:pl-12">
                    <button
                      type="button"
                      onClick={() => setSelectedClassId('GuideDog')}
                      className={`w-full rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                        selectedClassId === 'GuideDog'
                          ? 'border-sky-600 bg-sky-50/70 ring-1 ring-sky-600'
                          : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          class GuideDog(Dog)
                        </span>
                        <span className="text-xs text-amber-700 font-medium">
                          super().__init__()
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        多層繼承 · 繼承 Dog 與 Animal 並擴充認證編號
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Polymorphism Demonstration */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      多型實驗 (Polymorphism)：同一介面，不同表現
                    </h3>
                    <p className="text-xs text-slate-500">
                      用同一個迴圈呼叫 <code className="font-mono">pet.speak()</code>，各自依類別決定輸出
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPolyRunCount((c) => c + 1)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    批次呼叫 speak()
                  </button>
                </div>

                <div className="rounded-lg bg-slate-900 p-3.5 font-mono text-xs text-slate-200">
                  <div className="text-slate-400">
                    for animal in [Dog(&quot;小黑&quot;), Cat(&quot;橘子&quot;), GuideDog(&quot;阿福&quot;, &quot;TW-09&quot;)]:
                  </div>
                  <div className="pl-4 text-sky-300">print(animal.speak())</div>
                </div>

                {polyRunCount > 0 && (
                  <div className="mt-3 space-y-2">
                    {INHERITANCE_NODES.filter((n) => n.id !== 'Animal').map((node) => (
                      <div
                        key={node.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs"
                      >
                        <span className="font-mono text-slate-600">{node.demoInstance}.speak()</span>
                        <span className="font-semibold text-emerald-700">{node.demoSpeakOutput}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Class Inspector */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-6">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-mono text-base font-bold text-slate-900">
                    {selectedNode.name}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedNode.roleLabel}</p>
                </div>
                <span className="text-xs text-slate-500">
                  MRO 解析順序：{selectedNode.mro.join(' → ')}
                </span>
              </div>

              <div className="mb-5 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50/70 p-4 font-mono text-[13px] leading-6">
                {selectedNode.code.split('\n').map((line, i) => (
                  <div key={i} className="whitespace-pre">
                    <PythonSyntaxText line={line} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="text-xs font-semibold text-slate-800">繼承自父類</div>
                  <ul className="mt-2 space-y-1 font-mono text-xs text-slate-600">
                    {selectedNode.inheritedMethods.length === 0 ? (
                      <li className="text-slate-400">無（最頂層自訂類）</li>
                    ) : (
                      selectedNode.inheritedMethods.map((m) => <li key={m}>{m}</li>)
                    )}
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="text-xs font-semibold text-amber-800">覆寫 / 擴充</div>
                  <ul className="mt-2 space-y-1 font-mono text-xs text-amber-700">
                    {selectedNode.overriddenMethods.length === 0 ? (
                      <li className="text-slate-400">無覆寫方法</li>
                    ) : (
                      selectedNode.overriddenMethods.map((m) => <li key={m}>{m}</li>)
                    )}
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="text-xs font-semibold text-sky-800">子類專屬新增</div>
                  <ul className="mt-2 space-y-1 font-mono text-xs text-sky-700">
                    {selectedNode.ownMethods.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Encapsulation & @property */}
        {activeTab === 'encapsulation' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-6">
              <h3 className="text-sm font-semibold text-slate-900">
                為什麼需要封裝？試著輸入負數餘額比較差異
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                公開屬性允許外部隨意寫入非法數值；搭配私有屬性 (<code className="font-mono">__balance</code>) 與 <code className="font-mono">@property</code> setter 則能強制執行驗證規則。
              </p>

              <form onSubmit={handleTestEncapsulation} className="mt-4 flex flex-wrap items-end gap-3">
                <label className="flex-1 min-w-[180px]">
                  <span className="mb-1 block text-xs font-medium text-slate-700">
                    嘗試設定餘額數值 (例如：-500 或 2800)
                  </span>
                  <input
                    type="number"
                    value={rawAmountInput}
                    onChange={(e) => setRawAmountInput(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 tabular-nums focus:border-sky-600 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-lg bg-sky-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-800 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  執行寫入測試
                </button>
              </form>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="text-xs font-semibold text-slate-700">
                    無防護公開屬性 (acc.balance)
                  </div>
                  <div className="mt-2 font-mono text-2xl font-bold text-slate-900 tabular-nums">
                    {publicBalance}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    {publicBalance < 0
                      ? '危險：餘額已被污染成負數！'
                      : '直接覆寫成功，沒有任何檢查機制。'}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-sky-800">
                    受 @property 保護 (__balance)
                  </div>
                  <div className="mt-2 font-mono text-2xl font-bold text-slate-900 tabular-nums">
                    {protectedBalance}
                  </div>
                  <div className="mt-1.5 flex items-start gap-1.5 text-xs">
                    {setterStatus.ok ? (
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" aria-hidden="true" />
                    ) : (
                      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-700" aria-hidden="true" />
                    )}
                    <span className={setterStatus.ok ? 'text-emerald-800' : 'text-rose-800'}>
                      {setterStatus.message}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  Python 命名慣例與 Name Mangling
                </h3>
                <span className="text-xs text-slate-500">@property 標準寫法</span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50/70 p-4 font-mono text-[13px] leading-6">
                {[
                  'class SafeAccount:',
                  '    def __init__(self, balance):',
                  '        self.__balance = balance  # 雙底線觸發名稱改寫 (_SafeAccount__balance)',
                  '',
                  '    @property',
                  '    def balance(self):',
                  '        return self.__balance',
                  '',
                  '    @balance.setter',
                  '    def balance(self, value):',
                  '        if value < 0:',
                  '            raise ValueError("餘額不可為負數")',
                  '        self.__balance = value',
                ].map((line, i) => (
                  <div key={i} className="whitespace-pre">
                    <PythonSyntaxText line={line} />
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2.5 text-xs text-slate-600 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="font-mono font-bold text-slate-900">name</div>
                  <div className="mt-1">公開屬性，內外部皆可直接存取。</div>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="font-mono font-bold text-amber-800">_rate</div>
                  <div className="mt-1">單底線慣例：提醒開發者「內部使用，請勿直接改」。</div>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="font-mono font-bold text-sky-800">__balance</div>
                  <div className="mt-1">雙底線：Python 會自動改名為 <code className="font-mono">_類別__balance</code> 避免誤覆寫。</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Dunder / Magic Methods */}
        {activeTab === 'dunder' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-6">
              <h3 className="text-sm font-semibold text-slate-900">
                開關魔術方法，觀察 Python 內建語法如何與自訂物件互動
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                雙底線方法（Dunder Methods）讓自訂類別支援 <code className="font-mono">print()</code>、<code className="font-mono">len()</code> 與 <code className="font-mono">==</code> 等運算子。
              </p>

              <div className="mt-4 space-y-3">
                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3.5 cursor-pointer hover:bg-slate-50">
                  <div>
                    <div className="font-mono text-xs font-bold text-slate-900">
                      def __str__(self)
                    </div>
                    <div className="text-xs text-slate-500">
                      決定 print(playlist) 顯示的友善文字格式
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableStr}
                    onChange={(e) => setEnableStr(e.target.checked)}
                    className="h-4 w-4 accent-sky-700 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3.5 cursor-pointer hover:bg-slate-50">
                  <div>
                    <div className="font-mono text-xs font-bold text-slate-900">
                      def __len__(self)
                    </div>
                    <div className="text-xs text-slate-500">
                      讓內建函式 len(playlist) 能回傳歌曲數量
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableLen}
                    onChange={(e) => setEnableLen(e.target.checked)}
                    className="h-4 w-4 accent-sky-700 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3.5 cursor-pointer hover:bg-slate-50">
                  <div>
                    <div className="font-mono text-xs font-bold text-slate-900">
                      def __eq__(self, other)
                    </div>
                    <div className="text-xs text-slate-500">
                      自訂 p1 == p2 是比對歌單內容，而非記憶體位址
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableEq}
                    onChange={(e) => setEnableEq(e.target.checked)}
                    className="h-4 w-4 accent-sky-700 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-100 lg:col-span-6">
              <div className="mb-3 border-b border-slate-800 pb-2 text-xs font-semibold text-slate-300">
                即時互動終端機輸出比較 (p1 與 p2 內容相同，但位於不同記憶體)
              </div>

              <div className="space-y-3 font-mono text-xs leading-6">
                <div className="text-slate-400">
                  p1 = Playlist(&quot;專注歌單&quot;, [&quot;Lofi&quot;, &quot;Rain&quot;, &quot;Jazz&quot;])
                  <br />
                  p2 = Playlist(&quot;專注歌單&quot;, [&quot;Lofi&quot;, &quot;Rain&quot;, &quot;Jazz&quot;])
                </div>

                <div className="rounded-lg bg-slate-950 p-3">
                  <div className="text-sky-300">&gt;&gt;&gt; print(p1)</div>
                  <div className={enableStr ? 'text-emerald-300' : 'text-slate-400'}>
                    {enableStr
                      ? '歌單《專注歌單》(共 3 首)'
                      : '<__main__.Playlist object at 0x7f8a1020>'}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-950 p-3">
                  <div className="text-sky-300">&gt;&gt;&gt; len(p1)</div>
                  <div className={enableLen ? 'text-emerald-300' : 'text-rose-400'}>
                    {enableLen
                      ? '3'
                      : "TypeError: object of type 'Playlist' has no len()"}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-950 p-3">
                  <div className="text-sky-300">&gt;&gt;&gt; p1 == p2</div>
                  <div className={enableEq ? 'text-emerald-300' : 'text-amber-300'}>
                    {enableEq
                      ? 'True  # 依 __eq__ 比對歌名與曲目內容相同'
                      : 'False # 未定義 __eq__ 時預設比對記憶體位址 (p1 is p2)'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
