import React, { useEffect, useState } from 'react';
import { Play, Plus, RotateCcw, Terminal, Trash2, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CLASS_PRESETS, ClassPreset } from '../data/pythonOopData';
import { PythonSyntaxText } from './PythonSyntaxText';

export interface ObjectInstance {
  id: string;
  varName: string;
  address: string;
  attrs: Record<string, string | number | boolean>;
  shadowedClassAttr?: string;
}

interface ConsoleEntry {
  id: string;
  call: string;
  output: string;
  trace: string;
  isWarning?: boolean;
}

interface BlueprintSandboxProps {
  resetSignal: number;
}

function buildInitialAttrs(
  preset: ClassPreset,
  args: Record<string, string>
): Record<string, string | number | boolean> {
  if (preset.id === 'pet') {
    const rawEnergy = Number(args.energy ?? 80);
    return {
      name: (args.name || '無名寵物').trim(),
      energy: Math.max(0, Math.min(100, Number.isNaN(rawEnergy) ? 80 : rawEnergy)),
      mood: '好奇',
    };
  }
  if (preset.id === 'bank') {
    const rawBal = Number(args.balance ?? 1000);
    return {
      owner: (args.owner || '新戶頭').trim(),
      balance: Math.max(0, Number.isNaN(rawBal) ? 1000 : rawBal),
      is_locked: false,
    };
  }
  const rawWater = Number(args.water_ml ?? 300);
  return {
    location: (args.location || '一樓大廳').trim(),
    water_ml: Math.max(0, Math.min(500, Number.isNaN(rawWater) ? 300 : rawWater)),
    cups_made: 0,
  };
}

function makeMemoryAddress(index: number): string {
  const hex = (0x7f8a10 + index * 0x24).toString(16).toUpperCase();
  return `0x${hex}`;
}

export const BlueprintSandbox: React.FC<BlueprintSandboxProps> = ({ resetSignal }) => {
  const [presetId, setPresetId] = useState<ClassPreset['id']>('pet');
  const preset = CLASS_PRESETS.find((p) => p.id === presetId) ?? CLASS_PRESETS[0];

  const [classAttrValue, setClassAttrValue] = useState<string>(preset.classAttrDefault);
  const [instances, setInstances] = useState<ObjectInstance[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>('');
  const [activeLine, setActiveLine] = useState<number>(4);
  const [nextIndex, setNextIndex] = useState<number>(3);
  const [constructorInputs, setConstructorInputs] = useState<Record<string, string>>({});
  const [methodParamInputs, setMethodParamInputs] = useState<Record<string, string>>({});
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);

  const initializePreset = (targetPreset: ClassPreset) => {
    const initialList: ObjectInstance[] = targetPreset.initialInstances.map((item, idx) => ({
      id: `${targetPreset.id}-${idx + 1}`,
      varName: item.varName,
      address: makeMemoryAddress(idx + 1),
      attrs: buildInitialAttrs(targetPreset, item.args),
    }));

    const initFields: Record<string, string> = {};
    targetPreset.constructorFields.forEach((f) => {
      initFields[f.key] = f.defaultValue;
    });

    const initMethodParams: Record<string, string> = {};
    targetPreset.methods.forEach((m) => {
      m.params.forEach((p) => {
        initMethodParams[`${m.name}.${p.key}`] = p.defaultValue;
      });
    });

    setClassAttrValue(targetPreset.classAttrDefault);
    setInstances(initialList);
    setSelectedInstanceId(initialList[0]?.id ?? '');
    setActiveLine(4);
    setNextIndex(initialList.length + 1);
    setConstructorInputs(initFields);
    setMethodParamInputs(initMethodParams);
    setConsoleLogs([
      {
        id: 'init-0',
        call: `${initialList[0].varName} = ${targetPreset.className}(...)`,
        output: `<${targetPreset.className} object at ${initialList[0].address}>`,
        trace: `已依 ${targetPreset.className} 藍圖建立 ${initialList.length} 個獨立物件實例。`,
      },
    ]);
  };

  useEffect(() => {
    initializePreset(preset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetId, resetSignal]);

  const selectedInstance =
    instances.find((inst) => inst.id === selectedInstanceId) ?? instances[0] ?? null;

  const activeLineInfo =
    preset.codeLines.find((l) => l.line === activeLine) ??
    preset.codeLines.find((l) => l.line === 1)!;

  const handleCreateInstance = (e: React.FormEvent) => {
    e.preventDefault();
    if (instances.length >= 4) {
      setConsoleLogs((prev) => [
        {
          id: `warn-${Date.now()}`,
          call: `${preset.className}(...)`,
          output: '空間提示：最多同時顯示 4 個實例以便觀察比較',
          trace: '請先刪除任一現有實例，再建立新的物件。',
          isWarning: true,
        },
        ...prev.slice(0, 4),
      ]);
      return;
    }

    const varName = `${preset.varPrefix}_${nextIndex}`;
    const addr = makeMemoryAddress(nextIndex);
    const newInst: ObjectInstance = {
      id: `${preset.id}-${Date.now()}`,
      varName,
      address: addr,
      attrs: buildInitialAttrs(preset, constructorInputs),
    };

    const argSummary = preset.constructorFields
      .map((f) => {
        const val = constructorInputs[f.key] || f.defaultValue;
        return f.type === 'text' ? `"${val}"` : val;
      })
      .join(', ');

    setInstances((prev) => [...prev, newInst]);
    setSelectedInstanceId(newInst.id);
    setNextIndex((n) => n + 1);
    setActiveLine(4);
    setConsoleLogs((prev) => [
      {
        id: `create-${Date.now()}`,
        call: `${varName} = ${preset.className}(${argSummary})`,
        output: `<${preset.className} object at ${addr}>`,
        trace: `__init__(self=${varName}) 已配置新記憶體 ${addr}，與其他實例完全獨立。`,
      },
      ...prev.slice(0, 4),
    ]);
  };

  const handleDeleteInstance = (id: string) => {
    if (instances.length <= 1) return;
    const filtered = instances.filter((inst) => inst.id !== id);
    setInstances(filtered);
    if (selectedInstanceId === id) {
      setSelectedInstanceId(filtered[0].id);
    }
  };

  const handleCallMethod = (methodIndex: number) => {
    if (!selectedInstance) return;
    const method = preset.methods[methodIndex];
    const paramsForCall: Record<string, string> = {};
    method.params.forEach((p) => {
      paramsForCall[p.key] = methodParamInputs[`${method.name}.${p.key}`] ?? p.defaultValue;
    });

    const result = method.execute(
      selectedInstance.varName,
      selectedInstance.attrs,
      selectedInstance.shadowedClassAttr ?? classAttrValue,
      paramsForCall
    );

    setInstances((prev) =>
      prev.map((inst) =>
        inst.id === selectedInstance.id ? { ...inst, attrs: result.nextAttrs } : inst
      )
    );
    setActiveLine(result.highlightLine);
    setConsoleLogs((prev) => [
      {
        id: `call-${Date.now()}`,
        call: result.callExpression,
        output: result.consoleOutput,
        trace: result.selfTrace,
        isWarning:
          result.consoleOutput.includes('失敗') ||
          result.consoleOutput.includes('不足') ||
          result.consoleOutput.includes('太累'),
      },
      ...prev.slice(0, 4),
    ]);
  };

  const handleShadowOnSelected = () => {
    if (!selectedInstance) return;
    const customVal =
      selectedInstance.shadowedClassAttr !== undefined
        ? undefined
        : `${classAttrValue} (專屬)`;

    setInstances((prev) =>
      prev.map((inst) =>
        inst.id === selectedInstance.id
          ? { ...inst, shadowedClassAttr: customVal }
          : inst
      )
    );
    setActiveLine(2);
    setConsoleLogs((prev) => [
      {
        id: `shadow-${Date.now()}`,
        call:
          customVal !== undefined
            ? `${selectedInstance.varName}.${preset.classAttrName} = "${customVal}"`
            : `del ${selectedInstance.varName}.${preset.classAttrName}`,
        output:
          customVal !== undefined
            ? `僅 ${selectedInstance.varName} 覆寫為 "${customVal}"`
            : `${selectedInstance.varName} 恢復讀取類別屬性 "${classAttrValue}"`,
        trace:
          customVal !== undefined
            ? `屬性遮蔽 (Shadowing)：寫入 ${selectedInstance.varName}.__dict__，不影響類別與其他實例。`
            : `已刪除實例遮蔽屬性，查詢時重新向上查找 ${preset.className}.${preset.classAttrName}。`,
      },
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <section id="sandbox" className="mx-auto max-w-[1280px] px-6 pt-10 pb-14">
      {/* Editorial Hero Header */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-medium tracking-wide text-sky-700">
            01. 互動實驗室 · 類別藍圖與物件實例
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
            類別是設計藍圖，物件是記憶體中活生生的實體
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            切換下方範例類別，親自建立多個物件實例、修改類別屬性，並呼叫實例方法，觀察
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-sm font-medium text-amber-700">
              self
            </code>
            如何在彼此獨立的物件之間精準切換。
          </p>
        </div>

        {/* Preset Switcher Tabs */}
        <div
          role="tablist"
          aria-label="選擇範例類別"
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 self-start lg:self-auto"
        >
          {CLASS_PRESETS.map((item) => {
            const isActive = item.id === presetId;
            return (
              <button
                key={item.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setPresetId(item.id)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Analogy Strip */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-3.5">
        <div className="flex items-center gap-3 text-sm text-slate-700">
          <Layers className="h-4 w-4 shrink-0 text-sky-700" aria-hidden="true" />
          <span>{preset.analogy}</span>
        </div>
        <button
          type="button"
          onClick={() => initializePreset(preset)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          重設此範例
        </button>
      </div>

      {/* Two-Zone Sandbox */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Zone (Stage: Blueprint + Live Heap Objects) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Class Blueprint Code Card */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-5 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <span>類別設計藍圖</span>
                <span className="text-slate-400" aria-hidden="true">·</span>
                <span className="font-mono text-sky-700">class {preset.className}</span>
              </div>
              <span className="text-xs text-slate-500">點擊程式碼行查看語法解析</span>
            </div>

            <div className="divide-y divide-slate-100 py-2 font-mono text-[13px] leading-6 overflow-x-auto">
              {preset.codeLines.map((item) => {
                const isHighlighted = item.line === activeLine;
                return (
                  <button
                    key={item.line}
                    type="button"
                    onClick={() => setActiveLine(item.line)}
                    className={`flex w-full items-start gap-4 px-4 py-0.5 text-left transition-colors cursor-pointer ${
                      isHighlighted
                        ? 'bg-sky-50/90'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-6 shrink-0 select-none text-right text-xs leading-6 tabular-nums ${
                        isHighlighted ? 'font-bold text-sky-700' : 'text-slate-400'
                      }`}
                    >
                      {item.line}
                    </span>
                    <span className="whitespace-pre">
                      <PythonSyntaxText line={item.code} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Line Inspector Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
              <div className="flex flex-wrap items-baseline gap-2 text-xs">
                <span className="font-semibold text-sky-800 tabular-nums">
                  第 {activeLineInfo.line} 行 · {activeLineInfo.role}：
                </span>
                <span className="text-slate-700 leading-relaxed">
                  {activeLineInfo.explanation}
                </span>
              </div>
            </div>
          </div>

          {/* Live Object Heap Area */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  記憶體物件區 (Object Heap)
                </h2>
                <p className="text-xs text-slate-500">
                  每個卡片代表一個獨立實例 · 點擊卡片切換右側要操作的對象
                </p>
              </div>
              <span className="text-xs font-medium text-slate-600 tabular-nums">
                目前實例數：{instances.length} / 4
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {instances.map((inst) => {
                const isSelected = selectedInstance?.id === inst.id;
                const meterRaw = Number(inst.attrs[preset.meterKey]) || 0;
                const meterPct = Math.max(0, Math.min(100, (meterRaw / preset.meterMax) * 100));
                const effectiveClassAttr = inst.shadowedClassAttr ?? classAttrValue;
                const isShadowed = inst.shadowedClassAttr !== undefined;

                return (
                  <div
                    key={inst.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedInstanceId(inst.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedInstanceId(inst.id);
                      }
                    }}
                    className={`rounded-xl border p-4 text-left transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-700 ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/40 ring-1 ring-sky-600'
                        : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-slate-900">
                            {inst.varName}
                          </span>
                          <span className="font-mono text-xs text-slate-500 tabular-nums">
                            {inst.address}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {isSelected ? '目前選取中 (self 綁定對象)' : `點擊選取此 ${preset.className}`}
                        </p>
                      </div>

                      {instances.length > 1 && (
                        <button
                          type="button"
                          aria-label={`移除 ${inst.varName}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInstance(inst.id);
                          }}
                          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    {/* Numeric State Meter */}
                    <div className="mb-3">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-slate-600">{preset.meterLabel}</span>
                        <span className="font-mono font-semibold text-slate-900 tabular-nums">
                          {meterRaw}
                          {preset.meterUnit}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full transition-all duration-200 ${
                            meterPct < 25 ? 'bg-amber-600' : 'bg-sky-600'
                          }`}
                          style={{ width: `${meterPct}%` }}
                        />
                      </div>
                    </div>

                    {/* __dict__ Attributes Table */}
                    <div className="space-y-1.5 border-t border-slate-200/80 pt-2.5 font-mono text-xs">
                      {Object.entries(inst.attrs).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between gap-2">
                          <span className="text-slate-500">self.{key}</span>
                          <span className="font-medium text-slate-900 truncate tabular-nums">
                            {typeof val === 'string'
                              ? `"${val}"`
                              : typeof val === 'boolean'
                              ? val
                                ? 'True (鎖定)'
                                : 'False (正常)'
                              : val}
                          </span>
                        </div>
                      ))}

                      <div className="flex items-center justify-between gap-2 border-t border-dashed border-slate-200 pt-1.5">
                        <span className="text-slate-500">
                          {preset.classAttrName}{' '}
                          <span className="font-sans text-[11px] text-slate-400">
                            ({isShadowed ? '實例遮蔽' : '類別共用'})
                          </span>
                        </span>
                        <span
                          className={`truncate font-medium ${
                            isShadowed ? 'text-amber-700' : 'text-sky-700'
                          }`}
                        >
                          &quot;{effectiveClassAttr}&quot;
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Zone (Control Deck: Class Attr, Constructor, Method Caller, Console) */}
        <div className="space-y-5 lg:col-span-5">
          {/* 1. Constructor Form */}
          <form
            onSubmit={handleCreateInstance}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                1. 建立新物件實例 (<code className="font-mono text-sky-700">__init__</code>)
              </h3>
              <span className="font-mono text-xs text-slate-500">
                {preset.varPrefix}_{nextIndex} = {preset.className}(...)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {preset.constructorFields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    {field.label}
                  </span>
                  <input
                    type={field.type}
                    min={field.min}
                    max={field.max}
                    placeholder={field.placeholder}
                    value={constructorInputs[field.key] ?? field.defaultValue}
                    onChange={(e) =>
                      setConstructorInputs((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none"
                  />
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              呼叫建構子建立 {preset.varPrefix}_{nextIndex}
            </button>
          </form>

          {/* 2. Method Execution Deck */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                2. 對選取物件呼叫方法
              </h3>
              {selectedInstance && (
                <span className="font-mono text-xs font-semibold text-amber-700">
                  self → {selectedInstance.varName} ({selectedInstance.address})
                </span>
              )}
            </div>

            <div className="space-y-3">
              {preset.methods.map((method, idx) => (
                <div
                  key={method.name}
                  className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs font-semibold text-slate-900">
                        {selectedInstance?.varName}.{method.label}
                      </p>
                      <p className="text-xs text-slate-500">{method.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCallMethod(idx)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                      執行方法
                    </button>
                  </div>

                  {method.params.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-slate-200/80 pt-2">
                      {method.params.map((p) => (
                        <label key={p.key} className="flex items-center gap-2 text-xs text-slate-600">
                          <span>{p.label}:</span>
                          <input
                            type={p.type}
                            min={p.min}
                            max={p.max}
                            value={methodParamInputs[`${method.name}.${p.key}`] ?? p.defaultValue}
                            onChange={(e) =>
                              setMethodParamInputs((prev) => ({
                                ...prev,
                                [`${method.name}.${p.key}`]: e.target.value,
                              }))
                            }
                            className="w-24 rounded-md border border-slate-300 bg-white px-2.5 py-1 font-mono text-xs text-slate-900 tabular-nums focus:border-sky-600 focus:outline-none"
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Class Attribute & Shadowing Lab */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900">
              3. 類別屬性 vs 實例遮蔽實驗
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {preset.classAttrDescription}
            </p>

            <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="flex-1">
                <label className="sr-only" htmlFor="class-attr-input">
                  類別屬性值
                </label>
                <input
                  id="class-attr-input"
                  type="text"
                  value={classAttrValue}
                  onChange={(e) => {
                    setClassAttrValue(e.target.value);
                    setActiveLine(2);
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleShadowOnSelected}
                className="rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {selectedInstance?.shadowedClassAttr !== undefined
                  ? `取消 ${selectedInstance?.varName} 覆寫`
                  : `僅覆寫 ${selectedInstance?.varName}`}
              </button>
            </div>
          </div>

          {/* 4. Python Execution Console */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-slate-100">
            <div className="mb-2.5 flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Terminal className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                <span>Python 即時執行紀錄</span>
              </div>
              <span className="text-xs text-slate-400">最新 5 筆呼叫</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {consoleLogs.map((entry) => (
                <div key={entry.id} className="rounded-lg bg-slate-950/70 p-2.5">
                  <div className="text-sky-300">&gt;&gt;&gt; {entry.call}</div>
                  <div className="mt-1 flex items-start gap-1.5">
                    {entry.isWarning ? (
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
                    )}
                    <span className={entry.isWarning ? 'text-amber-300' : 'text-emerald-300'}>
                      {entry.output}
                    </span>
                  </div>
                  <div className="mt-1 font-sans text-[11px] text-slate-400">
                    {entry.trace}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
