"use client";

import { useState } from "react";
import { FIELDS, type Mode, type SolveFor } from "./types";
import { calcResult } from "./utils";
import ModePicker    from "./components/ModePicker";
import SolvePicker   from "./components/SolvePicker";
import NumericInput  from "./components/NumericInput";
import CosfInput     from "./components/CosfInput";
import PhasorCircle  from "./components/PhasorCircle";
import ResultCard    from "./components/ResultCard";
import VoltagePresets from "./components/VoltagePresets";

const STEPS: Record<SolveFor, number> = { U: 10, P: 100, I: 1 };

export default function IntensitePage() {
  const [mode,     setMode]     = useState<Mode>("monophase");
  const [solveFor, setSolveFor] = useState<SolveFor>("I");
  const [cosf,     setCosf]     = useState("1");
  const [vals,     setVals]     = useState<Record<SolveFor, string>>({ U: "", P: "", I: "" });

  const inputFields = (["P", "U", "I"] as const).filter((f) => f !== solveFor);

  const parsed = {
    U:    parseFloat(vals.U) || undefined,
    P:    parseFloat(vals.P) || undefined,
    I:    parseFloat(vals.I) || undefined,
    cosf: parseFloat(cosf)   || 1,
  };

  const result = calcResult(mode, solveFor, parsed);

  const allVals = {
    ...parsed,
    [solveFor]: result ?? undefined,
  } as { P?: number; U?: number; I?: number };

  const handleModeChange = (m: Mode) => {
    setMode(m);
    setVals({ U: "", P: "", I: "" });
  };

  const handleSolveFor = (s: SolveFor) => {
    setSolveFor(s);
    setVals((v) => ({ ...v, [s]: "" }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-900">
            <path d="M13 2L4.09 12.97H11L10 22l8.91-10.97H13L13 2z" />
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight">Calcul d&apos;intensité</h1>
          <p className="text-gray-400 text-xs">P = U × I (loi d&apos;Ohm — puissance)</p>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-5">

        <ModePicker mode={mode} onChange={handleModeChange} />

        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-center text-xs text-gray-500 mb-1 font-mono">
            {mode === "monophase" ? "P = U · I · cos φ" : "P = √3 · U · I · cos φ"}
          </p>
          <PhasorCircle cosf={parseFloat(cosf) || 1} solved={allVals} solveFor={solveFor} />
        </div>

        <SolvePicker solveFor={solveFor} onChange={handleSolveFor} />

        <div className="space-y-3">
          {inputFields.map((sym) => (
            <NumericInput
              key={sym}
              symbol={sym}
              label={FIELDS[sym].label}
              unit={FIELDS[sym].unit}
              color={FIELDS[sym].color}
              value={vals[sym]}
              onChange={(v) => setVals((prev) => ({ ...prev, [sym]: v }))}
              step={STEPS[sym]}
            />
          ))}
          <CosfInput value={cosf} onChange={setCosf} />
        </div>

        <ResultCard result={result} solveFor={solveFor} mode={mode} />

        <VoltagePresets
          disabled={solveFor === "U"}
          onSelect={(v) => setVals((prev) => ({ ...prev, U: v }))}
        />

      </main>
    </div>
  );
}
