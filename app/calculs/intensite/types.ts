export type Mode = "monophase" | "triphase";
export type SolveFor = "I" | "U" | "P";
export type Field = { label: string; unit: string; symbol: string; color: string };

export const FIELDS: Record<SolveFor, Field> = {
  P: { label: "Puissance", unit: "W",  symbol: "P", color: "#f59e0b" },
  U: { label: "Tension",   unit: "V",  symbol: "U", color: "#3b82f6" },
  I: { label: "Intensité", unit: "A",  symbol: "I", color: "#10b981" },
};
