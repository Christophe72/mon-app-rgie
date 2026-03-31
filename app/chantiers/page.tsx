"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  getChantiersServerSnapshot,
  getChantiersSnapshot,
  subscribeChantiers,
} from "./storage";
import TypeSupportBadge from "./components/TypeSupportBadge";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ChantiersPage() {
  // Store externe localStorage avec snapshot stable pour éviter les boucles de rendu.
  const chantiers = useSyncExternalStore(
    subscribeChantiers,
    getChantiersSnapshot,
    getChantiersServerSnapshot,
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <Link
          href="/"
          className="text-gray-400 hover:text-gray-200 p-1 -ml-1 transition-colors"
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
        <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-none stroke-white"
            strokeWidth={2}
          >
            <path
              d="M2 17h20M12 3v3M5.2 10A7 7 0 0 1 19 10H5.2z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M4 10v7M20 10v7" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base leading-tight">Chantiers</h1>
          <p className="text-gray-400 text-xs">
            {chantiers.length} chantier{chantiers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/chantiers/new"
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition-all"
        >
          + Nouveau
        </Link>
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        {chantiers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <p className="text-gray-500 text-sm">Aucun chantier enregistré</p>
            <Link
              href="/chantiers/new"
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg px-4 py-2 font-semibold text-white text-sm transition-all"
            >
              Créer le premier chantier
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {chantiers.map((c) => (
              <Link
                key={c.id}
                href={`/chantiers/detail?id=${c.id}`}
                className="block bg-gray-900 rounded-xl px-4 py-3 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm truncate">{c.nom}</p>
                  <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                    {c.typeSupport.map((ts) => (
                      <TypeSupportBadge key={ts} typeSupport={ts} size="xs" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-0.5">
                  {[c.adresse, c.ville].filter(Boolean).join(", ") || "—"}
                </p>
                <p className="text-gray-600 text-[10px] mt-1 font-mono">
                  {fmtDate(c.datePrevue)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
