"use client";

import { FIELDS, type SolveFor } from "../types";

interface Props {
  solveFor: SolveFor;
  onChange: (s: SolveFor) => void;
}

export default function SolvePicker({ solveFor, onChange }: Props) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">
        Calculer
      </p>
      <div className="grid grid-cols-3 gap-2">
        {(["I", "U", "P"] as const).map((s) => {
          const f = FIELDS[s];
          const active = solveFor === s;
          return (
            <button
              key={s}
              onClick={() => onChange(s)}
              style={active ? { backgroundColor: f.color } : {}}
              className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                active
                  ? "text-gray-900 shadow-lg scale-105"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span className="block text-lg leading-none">{s}</span>
              <span className="block text-[10px] font-normal opacity-80">{f.unit}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
