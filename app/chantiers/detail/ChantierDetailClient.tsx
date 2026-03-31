"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadChantiers, deleteChantier } from "../storage";
import { TYPE_SUPPORT_META, STATUT_META } from "../types";
import { getDifficultyCoefficient } from "../utils";
import TypeSupportBadge from "../components/TypeSupportBadge";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-BE", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-sm text-gray-200 text-right">{value}</span>
    </div>
  );
}

export default function ChantierDetailClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const router = useRouter();
  const [chantier] = useState(() => loadChantiers().find((c) => c.id === id) ?? null);

  const handleDelete = () => {
    if (!confirm("Supprimer ce chantier ?")) return;
    deleteChantier(id);
    router.push("/chantiers");
  };

  if (!chantier) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Chantier introuvable.</p>
        <Link href="/chantiers" className="text-blue-400 text-sm hover:underline">
          Retour à la liste
        </Link>
      </div>
    );
  }

  const coefficient = getDifficultyCoefficient(chantier.typeSupport);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <Link href="/chantiers" className="text-gray-400 hover:text-gray-200 p-1 -ml-1 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth={2.5}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base leading-tight truncate">{chantier.nom}</h1>
          <p className="text-gray-400 text-xs">{STATUT_META[chantier.statut].label}</p>
        </div>
        <Link href={`/chantiers/edit?id=${chantier.id}`}
          className="text-xs text-gray-400 hover:text-gray-200 transition-colors px-2 py-1 bg-gray-800 rounded-lg">
          Modifier
        </Link>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-4 pb-8">

        <div className="bg-gray-900 rounded-xl p-4 space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Informations</p>
          <Row label="Adresse"
            value={[chantier.adresse, chantier.codePostal, chantier.ville].filter(Boolean).join(" ") || "—"} />
          <Row label="Date prévue" value={fmtDate(chantier.datePrevue)} />
          {chantier.description && (
            <p className="text-sm text-gray-400 pt-1 leading-relaxed">{chantier.description}</p>
          )}
        </div>

        <div className="bg-gray-900 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Type de support</p>
            <span className="text-gray-400 text-sm font-mono">×{coefficient.toFixed(1)} difficulté</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {chantier.typeSupport.map((ts) => (
              <TypeSupportBadge key={ts} typeSupport={ts} />
            ))}
          </div>
          <div className="space-y-1.5">
            {chantier.typeSupport.map((ts) => (
              <div key={ts} className="flex gap-2 items-start bg-gray-800 rounded-xl p-3">
                <span className="text-yellow-400 text-sm shrink-0 mt-0.5">💡</span>
                <p className="text-xs text-gray-400 leading-relaxed">{TYPE_SUPPORT_META[ts].hint}</p>
              </div>
            ))}
          </div>
        </div>

        {chantier.contraintes && (
          <div className="bg-gray-900 rounded-xl p-4 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Contraintes</p>
            <p className="text-sm text-gray-300 leading-relaxed">{chantier.contraintes}</p>
          </div>
        )}

        <button type="button" onClick={handleDelete}
          className="w-full py-2.5 rounded-xl border border-red-900 text-red-500 text-sm font-semibold hover:bg-red-950 active:scale-95 transition-all">
          Supprimer ce chantier
        </button>

      </main>
    </div>
  );
}
