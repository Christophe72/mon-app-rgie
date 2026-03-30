"use client";

const BTN =
  "w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-90 active:bg-gray-600 transition-all flex items-center justify-center text-gray-200 font-bold text-xl select-none";

interface Props {
  symbol: string;
  label: string;
  unit: string;
  color: string;
  value: string;
  onChange: (v: string) => void;
  step: number;
  min?: number;
  max?: number;
}

export default function NumericInput({
  symbol, label, unit, color, value, onChange, step, min = 0, max,
}: Props) {
  const decimals = step < 1 ? (String(step).split(".")[1]?.length ?? 2) : 0;

  const adjust = (delta: number) => {
    const current = parseFloat(value) || 0;
    let next = parseFloat((current + delta).toFixed(decimals));
    next = Math.max(min, next);
    if (max != null) next = Math.min(max, next);
    onChange(String(next));
  };

  return (
    <div className="bg-gray-900 rounded-xl px-3 py-3 flex items-center gap-2">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-gray-900 text-sm"
        style={{ backgroundColor: color }}
      >
        {symbol}
      </div>
      <div className="flex-1 min-w-0 px-1">
        <p className="text-[10px] text-gray-400 leading-none mb-0.5">{label}</p>
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent text-white text-lg font-semibold outline-none placeholder-gray-700
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-gray-500 font-mono text-xs flex-shrink-0">{unit}</span>
        </div>
      </div>
      <button onPointerDown={(e) => e.preventDefault()} onClick={() => adjust(-step)} className={BTN}>−</button>
      <button onPointerDown={(e) => e.preventDefault()} onClick={() => adjust(step)}  className={BTN}>+</button>
    </div>
  );
}
