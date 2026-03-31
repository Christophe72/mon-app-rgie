export type TypeSupport = "VOILE_BETON" | "BLOC" | "IMPEX" | "MIXTE";

export type StatutChantier = "EN_ATTENTE" | "EN_COURS" | "TERMINE" | "ANNULE";

export interface Chantier {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  description: string;
  statut: StatutChantier;
  datePrevue: string;
  typeSupport: TypeSupport[];
  contraintes?: string;
  createdAt: string;
}

export const TYPE_SUPPORT_META: Record<
  TypeSupport,
  { label: string; hint: string; coefficient: number }
> = {
  VOILE_BETON: {
    label: "Voile béton",
    hint: "Support difficile, durée potentiellement plus longue",
    coefficient: 2.0,
  },
  BLOC: {
    label: "Bloc",
    hint: "Support standard",
    coefficient: 1.2,
  },
  IMPEX: {
    label: "Impex",
    hint: "Support rapide à travailler",
    coefficient: 1.0,
  },
  MIXTE: {
    label: "Mixte",
    hint: "Supports variés, durée à nuancer",
    coefficient: 1.5,
  },
};

export const STATUT_META: Record<StatutChantier, { label: string }> = {
  EN_ATTENTE: { label: "En attente" },
  EN_COURS:   { label: "En cours" },
  TERMINE:    { label: "Terminé" },
  ANNULE:     { label: "Annulé" },
};
