"use client";

const PRESETS = [
  { label: "Mono phase", v: "230", desc: "Phase–Neutre" },
  { label: "Tri phase",  v: "400", desc: "Phase–Phase"  },
  { label: "TBTS",       v: "50",  desc: "AC sécurité"  },
  { label: "TBTS DC",    v: "120", desc: "DC sécurité"  },
];

interface Props {
  disabled: boolean;
  onSelect: (v: string) => void;
}

export default function VoltagePresets({ disabled, onSelect }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-semibold">
        Tensions de référence (RGIE)
      </p>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map(({ label, v, desc }) => (
          <button
            key={v + desc}
            onClick={() => onSelect(v)}
            disabled={disabled}
            className="bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="block text-blue-400 font-bold text-sm">{v} V</span>
            <span className="block text-gray-400 text-xs">{label}</span>
            <span className="block text-gray-600 text-[10px]">{desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
