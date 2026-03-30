"use client";

const PRESETS: [string, string][] = [["1", "res"], ["0.85", "ind"], ["0.7", "mot"]];
const BTN =
  "w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-90 transition-all flex items-center justify-center text-gray-200 font-bold text-xl select-none";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function CosfInput({ value, onChange }: Props) {
  const adjust = (delta: number) => {
    const v = parseFloat(value) || 1;
    onChange(String(Math.min(1, Math.max(0.1, parseFloat((v + delta).toFixed(2))))));
  };

  return (
    <div className="bg-gray-900 rounded-xl px-3 py-3 flex items-center gap-2">
      <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0 font-bold text-white text-[10px] leading-tight text-center">
        cos<br />φ
      </div>
      <div className="flex-1 px-1">
        <p className="text-[10px] text-gray-400 leading-none mb-0.5">Facteur de puissance</p>
        <div className="flex items-baseline gap-1">
          <input
            title="Cos φ (facteur de puissance) entre 0.1 et 1"
            type="number"
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-white text-lg font-semibold outline-none
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="flex gap-1 flex-shrink-0">
            {PRESETS.map(([v, lbl]) => (
              <button
                key={v}
                onClick={() => onChange(v)}
                className={`text-[9px] px-1.5 py-1 rounded-lg transition-colors font-mono ${
                  value === v ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {v}<br /><span className="opacity-60">{lbl}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <button onPointerDown={(e) => e.preventDefault()} onClick={() => adjust(-0.05)} className={BTN}>−</button>
      <button onPointerDown={(e) => e.preventDefault()} onClick={() => adjust(+0.05)} className={BTN}>+</button>
    </div>
  );
}
