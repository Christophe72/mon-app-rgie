import type { Mode, SolveFor } from "./types";

const SQRT3 = Math.sqrt(3);

export function calcResult(
  mode: Mode,
  solveFor: SolveFor,
  vals: { U?: number; P?: number; I?: number; cosf: number }
): number | null {
  const { U, P, I, cosf } = vals;
  const k = mode === "triphase" ? SQRT3 : 1;
  if (cosf <= 0 || cosf > 1) return null;
  if (solveFor === "I" && U != null && P != null && U > 0) return P / (k * U * cosf);
  if (solveFor === "U" && I != null && P != null && I > 0) return P / (k * I * cosf);
  if (solveFor === "P" && U != null && I != null) return k * U * I * cosf;
  return null;
}

export function fmt(n: number): string {
  if (Math.abs(n) >= 1000) return n.toFixed(0);
  if (Math.abs(n) >= 100)  return n.toFixed(1);
  if (Math.abs(n) >= 10)   return n.toFixed(2);
  return n.toFixed(3);
}
