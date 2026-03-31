"use client";

import { FIELDS, type Mode, type SolveFor } from "../types";
import { fmt } from "../utils";

interface Props {
  result: number | null;
  solveFor: SolveFor;
  mode: Mode;
}

const FORMULA: Record<SolveFor, (tri: boolean) => string> = {
  I: (tri) => `I = P ÷ (${tri ? "√3 × " : ""}U × cos φ)`,
  U: (tri) => `U = P ÷ (${tri ? "√3 × " : ""}I × cos φ)`,
  P: (tri) => `P = ${tri ? "√3 × " : ""}U × I × cos φ`,
};

export default function ResultCard({ result, solveFor, mode }: Props) {
  const f = FIELDS[solveFor];
  const hasResult = result != null;

  return (
    <div
      className={`rounded-xl p-5 transition-all ${
        hasResult
          ? "bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700"
          : "bg-gray-900 border border-gray-800 opacity-50"
      }`}
    >
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-semibold">
        Résultat — {f.label}
      </p>
      {hasResult ? (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tabular-nums" style={{ color: f.color }}>
              {fmt(result)}
            </span>
            <span className="text-xl font-semibold text-gray-400">{f.unit}</span>
          </div>
          <p className="mt-2 text-xs font-mono text-gray-500">
            {FORMULA[solveFor](mode === "triphase")}
          </p>
        </>
      ) : (
        <p className="text-gray-600 text-sm">Renseignez les valeurs ci-dessus</p>
      )}
    </div>
  );
}
