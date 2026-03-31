"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { addChantier } from "../storage";
import ChantierForm from "../components/ChantierForm";
import type { Chantier } from "../types";

type FormData = Omit<Chantier, "id" | "createdAt">;

export default function NewChantierPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <Link href="/chantiers" className="text-gray-400 hover:text-gray-200 p-1 -ml-1 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth={2.5}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div>
          <h1 className="font-bold text-base leading-tight">Nouveau chantier</h1>
          <p className="text-gray-400 text-xs">Renseigner les informations</p>
        </div>
      </header>
      <main className="flex-1 p-4 max-w-md mx-auto w-full pb-8">
        <ChantierForm
          submitLabel="Créer le chantier"
          onSubmit={(data: FormData) => {
            addChantier(data);
            router.push("/chantiers");
          }}
        />
      </main>
    </div>
  );
}
