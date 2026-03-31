import { type TypeSupport, TYPE_SUPPORT_META } from "./types";

// Retourne la moyenne des coefficients des supports sélectionnés.
export function getDifficultyCoefficient(types: TypeSupport[]): number {
  if (types.length === 0) return 1.0;
  const sum = types.reduce((acc, ts) => acc + TYPE_SUPPORT_META[ts].coefficient, 0);
  return sum / types.length;
}

export function getTypeSupportBadgeColor(ts: TypeSupport): string {
  const map: Record<TypeSupport, string> = {
    VOILE_BETON: "bg-amber-500/15 text-amber-400",
    BLOC:        "bg-blue-500/15 text-blue-400",
    IMPEX:       "bg-emerald-500/15 text-emerald-400",
    MIXTE:       "bg-purple-500/15 text-purple-400",
  };
  return map[ts];
}
