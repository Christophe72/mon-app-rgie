"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadChantiers, updateChantier } from "../storage";
import ChantierForm from "../components/ChantierForm";
import type { Chantier } from "../types";

type FormData = Omit<Chantier, "id" | "createdAt">;

export default function EditChantierClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const router = useRouter();
  const [chantier] = useState(() => loadChantiers().find((c) => c.id === id) ?? null);

  if (!chantier) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Chantier introuvable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <Link href={`/chantiers/detail?id=${id}`}
          className="text-gray-400 hover:text-gray-200 p-1 -ml-1 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth={2.5}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div>
          <h1 className="font-bold text-base leading-tight">Modifier le chantier</h1>
          <p className="text-gray-400 text-xs truncate max-w-50">{chantier.nom}</p>
        </div>
      </header>
      <main className="flex-1 p-4 max-w-md mx-auto w-full pb-8">
        <ChantierForm
          initial={chantier}
          submitLabel="Enregistrer les modifications"
          onSubmit={(data: FormData) => {
            updateChantier(id, data);
            router.push(`/chantiers/detail?id=${id}`);
          }}
        />
      </main>
    </div>
  );
}
