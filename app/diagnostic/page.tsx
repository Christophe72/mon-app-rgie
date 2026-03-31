"use client";

import { useState } from "react";
import Link from "next/link";
import { TREE, ROOT_ID, type Severity } from "./tree";

type Step = { nodeId: string; answer: "yes" | "no" };

const SEVERITY_STYLES: Record<
  Severity,
  {
    bg: string;
    border: string;
    icon: string;
    label: string;
    iconColor: string;
    actionDot: string;
  }
> = {
  ok: {
    bg: "bg-emerald-950",
    border: "border-emerald-600",
    icon: "✓",
    label: "Résolu",
    iconColor: "text-emerald-400",
    actionDot: "bg-emerald-600",
  },
  info: {
    bg: "bg-blue-950",
    border: "border-blue-600",
    icon: "ℹ",
    label: "Information",
    iconColor: "text-blue-400",
    actionDot: "bg-blue-600",
  },
  warning: {
    bg: "bg-amber-950",
    border: "border-amber-500",
    icon: "⚠",
    label: "Attention",
    iconColor: "text-amber-400",
    actionDot: "bg-amber-500",
  },
  danger: {
    bg: "bg-red-950",
    border: "border-red-600",
    icon: "✕",
    label: "Danger",
    iconColor: "text-red-400",
    actionDot: "bg-red-600",
  },
};

function ProgressBar({ count }: { count: number }) {
  const pct = Math.min(Math.round((count / 8) * 100), 100);
  return (
    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
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
      className="w-full text-left flex items-start gap-2.5 group py-1"
    >
      <span
        className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
          step.answer === "yes" ? "bg-emerald-600" : "bg-red-700"
        }`}
      >
        {step.answer === "yes" ? "O" : "N"}
      </span>
      <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors leading-relaxed">
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

  const rewind = (idx: number) => setHistory((h) => h.slice(0, idx));
  const reset = () => setHistory([]);

  const sev =
    current.type === "result" ? SEVERITY_STYLES[current.severity] : null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link
          href="/"
          className="text-gray-400 hover:text-gray-200 transition-colors p-1 -ml-1"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-none stroke-current"
            strokeWidth={2.5}
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-none stroke-white"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base leading-tight">
            Recherche de panne
          </h1>
          <p className="text-gray-400 text-xs">Diagnostic guidé</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={reset}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg"
          >
            Recommencer
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full gap-4">
        {/* Progression */}
        {history.length > 0 && <ProgressBar count={history.length} />}

        {/* Historique */}
        {history.length > 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 px-4 py-3 space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
              Étapes — appuyer pour revenir
            </p>
            {history.map((step, i) => (
              <HistoryItem key={i} step={step} index={i} onRewind={rewind} />
            ))}
          </div>
        )}

        {/* Question */}
        {current.type === "question" && (
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                {history.length + 1}
              </div>
              <div className="h-px flex-1 bg-gray-800" />
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-3">
              <p className="text-lg font-semibold leading-snug">
                {current.question}
              </p>
              {current.hint && (
                <div className="flex gap-2 items-start bg-gray-800 rounded-xl p-3">
                  <span className="text-yellow-400 text-sm shrink-0 mt-0.5">
                    💡
                  </span>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {current.hint}
                  </p>
                </div>
              )}
            </div>

            {/* Boutons OUI / NON — bordures colorées */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button
                onClick={() => answer("yes")}
                className="flex flex-col items-center justify-center gap-1.5 bg-gray-900 hover:bg-emerald-950 active:scale-95 border-2 border-emerald-600 rounded-2xl py-6 transition-all"
              >
                <span className="text-3xl text-emerald-400">✓</span>
                <span className="text-emerald-400 text-sm tracking-wide font-bold">
                  OUI
                </span>
              </button>
              <button
                onClick={() => answer("no")}
                className="flex flex-col items-center justify-center gap-1.5 bg-gray-900 hover:bg-red-950 active:scale-95 border-2 border-red-700 rounded-2xl py-6 transition-all"
              >
                <span className="text-3xl text-red-400">✕</span>
                <span className="text-red-400 text-sm tracking-wide font-bold">
                  NON
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Résultat */}
        {current.type === "result" && sev && (
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${sev.iconColor} bg-gray-800`}
              >
                {sev.icon}
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-widest ${sev.iconColor}`}
              >
                {sev.label}
              </span>
              <div className="h-px flex-1 bg-gray-800" />
            </div>

            {/* Carte fond sombre coloré */}
            <div
              className={`rounded-2xl border p-5 space-y-4 ${sev.bg} ${sev.border}`}
            >
              <h2 className="text-xl font-black leading-tight text-gray-100">
                {current.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {current.body}
              </p>

              {/* Actions dans cartes séparées */}
              <div className="space-y-2 pt-1">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                  Que faire
                </p>
                {current.actions.map((action, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-start bg-black bg-opacity-30 rounded-xl p-3 border border-gray-700"
                  >
                    <span
                      className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5 ${sev.actionDot}`}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-600 text-center">
              Diagnostic en {history.length} étape
              {history.length > 1 ? "s" : ""}
            </p>

            <button
              onClick={reset}
              className="w-full py-4 bg-gray-800 hover:bg-gray-700 active:scale-95 rounded-2xl font-semibold transition-all text-sm text-gray-200"
            >
              Nouveau diagnostic
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
