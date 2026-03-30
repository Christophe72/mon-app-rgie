"use client";

import type { Mode } from "../types";

interface Props {
  mode: Mode;
  onChange: (m: Mode) => void;
}

export default function ModePicker({ mode, onChange }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-1 flex gap-1">
      {(["monophase", "triphase"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            mode === m ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {m === "monophase" ? "Monophasé 1φ" : "Triphasé 3φ"}
        </button>
      ))}
    </div>
  );
}
