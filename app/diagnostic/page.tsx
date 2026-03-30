"use client";

import { useState } from "react";
import Link from "next/link";
import { TREE, ROOT_ID, type Severity } from "./tree";

type Step = { nodeId: string; answer: "yes" | "no" };

const SEVERITY_STYLES: Record<
  Severity,
  { bg: string; border: string; icon: string; label: string; iconColor: string }
> = {
  ok: {
    bg: "bg-emerald-950",
    border: "border-emerald-600",
    icon: "✓",
    label: "Résolu",
    iconColor: "text-emerald-400",
  },
  info: {
    bg: "bg-blue-950",
    border: "border-blue-600",
    icon: "ℹ",
    label: "Information",
    iconColor: "text-blue-400",
  },
  warning: {
    bg: "bg-amber-950",
    border: "border-amber-500",
    icon: "⚠",
    label: "Attention",
    iconColor: "text-amber-400",
  },
  danger: {
    bg: "bg-red-950",
    border: "border-red-600",
    icon: "✕",
    label: "Danger",
    iconColor: "text-red-400",
  },
};

function ProgressDots({ count, total }: { count: number; total: number }) {
  const est = Math.min(total, 8);
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: est }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < count ? "w-4 bg-blue-500" : "w-1.5 bg-gray-700"
          }`}
        />
      ))}
    </div>
  );
}

function HistoryItem({
  step,
  index,
  onRewind,
}: {
  step: Step;
  index: number;
  onRewind: (idx: number) => void;
}) {
  const node = TREE[step.nodeId];
  if (node.type !== "question") return null;
  return (
    <button
      onClick={() => onRewind(index)}
      className="w-full text-left flex items-start gap-3 group"
    >
      <div
        className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
          step.answer === "yes"
            ? "bg-emerald-600 text-white"
            : "bg-red-700 text-white"
        }`}
      >
        {step.answer === "yes" ? "O" : "N"}
      </div>
      <p className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">
        {node.question}
      </p>
    </button>
  );
}

export default function DiagnosticPage() {
  const [history, setHistory] = useState<Step[]>([]);

  const currentId =
    history.length === 0
      ? ROOT_ID
      : (() => {
          const last = history[history.length - 1];
          const node = TREE[last.nodeId];
          if (node.type !== "question") return last.nodeId;
          return last.answer === "yes" ? node.yes : node.no;
        })();

  const current = TREE[currentId];

  const answer = (choice: "yes" | "no") => {
    if (current.type !== "question") return;
    setHistory((h) => [...h, { nodeId: currentId, answer: choice }]);
  };

  const rewind = (idx: number) => {
    setHistory((h) => h.slice(0, idx));
  };

  const reset = () => setHistory([]);

  const isResult = current.type === "result";
  const sev = isResult ? SEVERITY_STYLES[current.severity] : null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-gray-200 transition-colors p-1 -ml-1">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth={2.5}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base leading-tight">Recherche de panne</h1>
          <p className="text-gray-400 text-xs">Diagnostic guidé</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={reset}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 bg-gray-800 rounded-lg"
          >
            Recommencer
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full gap-4">

        {/* Progression */}
        {history.length > 0 && (
          <ProgressDots count={history.length} total={8} />
        )}

        {/* Historique des réponses */}
        {history.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">
              Étapes — appuyer pour revenir
            </p>
            {history.map((step, i) => (
              <HistoryItem key={i} step={step} index={i} onRewind={rewind} />
            ))}
          </div>
        )}

        {/* Question courante */}
        {current.type === "question" && (
          <div className="flex-1 flex flex-col gap-4">
            {/* Numéro */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {history.length + 1}
              </div>
              <div className="h-px flex-1 bg-gray-800" />
            </div>

            {/* Question */}
            <div className="bg-gray-900 rounded-2xl p-5 space-y-3">
              <p className="text-lg font-semibold leading-snug">
                {current.question}
              </p>
              {current.hint && (
                <div className="flex gap-2 items-start bg-gray-800 rounded-xl p-3">
                  <span className="text-yellow-400 text-sm flex-shrink-0 mt-0.5">💡</span>
                  <p className="text-xs text-gray-400 leading-relaxed">{current.hint}</p>
                </div>
              )}
            </div>

            {/* Boutons OUI / NON */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button
                onClick={() => answer("yes")}
                className="flex flex-col items-center justify-center gap-1 bg-emerald-900 hover:bg-emerald-800 active:scale-95 border border-emerald-700 rounded-2xl py-6 transition-all font-bold"
              >
                <span className="text-3xl">✓</span>
                <span className="text-emerald-300 text-sm tracking-wide">OUI</span>
              </button>
              <button
                onClick={() => answer("no")}
                className="flex flex-col items-center justify-center gap-1 bg-red-950 hover:bg-red-900 active:scale-95 border border-red-800 rounded-2xl py-6 transition-all font-bold"
              >
                <span className="text-3xl">✕</span>
                <span className="text-red-300 text-sm tracking-wide">NON</span>
              </button>
            </div>
          </div>
        )}

        {/* Résultat */}
        {current.type === "result" && sev && (
          <div className="flex-1 flex flex-col gap-4">
            {/* Badge sévérité */}
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${sev.iconColor} bg-gray-800`}>
                {sev.icon}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${sev.iconColor}`}>
                {sev.label}
              </span>
              <div className="h-px flex-1 bg-gray-800" />
            </div>

            {/* Carte résultat */}
            <div className={`rounded-2xl border p-5 space-y-4 ${sev.bg} ${sev.border}`}>
              <h2 className="text-xl font-black leading-tight">{current.title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{current.body}</p>

              <div className="space-y-2 pt-1">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                  Actions recommandées
                </p>
                {current.actions.map((action, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className={`flex-shrink-0 font-bold text-xs mt-0.5 ${sev.iconColor}`}>
                      {i + 1}.
                    </span>
                    <p className="text-sm text-gray-200 leading-relaxed">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Étapes suivies */}
            <p className="text-xs text-gray-500 text-center">
              Diagnostic en {history.length} étape{history.length > 1 ? "s" : ""}
            </p>

            {/* Bouton recommencer */}
            <button
              onClick={reset}
              className="w-full py-4 bg-gray-800 hover:bg-gray-700 active:scale-95 rounded-2xl font-semibold transition-all text-sm"
            >
              Nouveau diagnostic
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
