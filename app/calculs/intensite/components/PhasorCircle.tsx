"use client";

import type { SolveFor } from "../types";
import { fmt } from "../utils";

interface Props {
  cosf: number;
  solved: { P?: number; U?: number; I?: number } | null;
  solveFor: SolveFor;
}

function Arrow({
  x1, y1, x2, y2, color, width = 2.5,
}: {
  x1: number; y1: number; x2: number; y2: number; color: string; width?: number;
}) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return null;
  const ux = dx / len, uy = dy / len;
  const tip = 7, wing = 3.5;
  const bx = x2 - tip * ux, by = y2 - tip * uy;
  const p1x = bx + wing * uy, p1y = by - wing * ux;
  const p2x = bx - wing * uy, p2y = by + wing * ux;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - tip * ux * 0.6} y2={y2 - tip * uy * 0.6}
        stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}`} fill={color} />
    </g>
  );
}

export default function PhasorCircle({ cosf, solved, solveFor }: Props) {
  const clampedCos = Math.max(0.001, Math.min(1, cosf));
  const phi    = Math.acos(clampedCos);
  const phiDeg = phi * 180 / Math.PI;
  const sinPhi = Math.sin(phi);

  const cx = 72, cy = 64;
  const R  = 50; // rayon U
  const iR = 38; // rayon I (plus court pour le distinguer)

  const ix = cx + iR * clampedCos;
  const iy = cy + iR * sinPhi;

  const arcR  = 18;
  const arcEx = cx + arcR * clampedCos;
  const arcEy = cy + arcR * sinPhi;

  const iLabelX = cx + (iR + 15) * clampedCos;
  const iLabelY = cy + (iR + 15) * sinPhi;

  return (
    <svg viewBox="0 0 168 138" className="w-full h-44 select-none">

      {/* Axes */}
      <line x1={cx - 58} y1={cy} x2={cx + 62} y2={cy} stroke="#374151" strokeWidth="0.8" />
      <line x1={cx} y1={cy - 58} x2={cx} y2={cy + 60} stroke="#374151" strokeWidth="0.8" />

      {/* Cercle trigonométrique */}
      <circle cx={cx} cy={cy} r={R}
        fill="none" stroke="#1f2937" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Projection cos φ / sin φ */}
      {phi > 0.04 && (
        <>
          <line x1={ix} y1={iy} x2={ix} y2={cy}
            stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
          <line x1={cx} y1={cy + 9} x2={ix} y2={cy + 9} stroke="#a855f7" strokeWidth="1.5" />
          <text x={(cx + ix) / 2} y={cy + 18} textAnchor="middle" fontSize="6.5"
            fill="#a855f7" fontWeight="bold">cos φ</text>
          <line x1={ix + 5} y1={cy} x2={ix + 5} y2={iy} stroke="#6b7280" strokeWidth="1" />
          <text x={ix + 10} y={(cy + iy) / 2 + 3} textAnchor="start" fontSize="5.5"
            fill="#6b7280">sin φ</text>
        </>
      )}

      {/* Arc angle φ */}
      {phi > 0.04 && (
        <>
          <path d={`M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 1 ${arcEx} ${arcEy}`}
            fill="none" stroke="#a855f7" strokeWidth="1.5" />
          <text
            x={cx + (arcR + 9) * Math.cos(phi / 2)}
            y={cy + (arcR + 9) * Math.sin(phi / 2) + 2}
            textAnchor="middle" fontSize="8" fill="#a855f7" fontWeight="bold"
          >φ</text>
        </>
      )}

      {/* Vecteur U — fixe sur l'axe réel */}
      <Arrow x1={cx} y1={cy} x2={cx + R} y2={cy} color="#3b82f6" />
      <circle cx={cx + R + 13} cy={cy} r="9"
        fill={solveFor === "U" ? "#3b82f6" : "#1e3a5f"} />
      <text x={cx + R + 13} y={cy + 3.5} textAnchor="middle"
        fontSize="8" fontWeight="bold" fill="white">U</text>
      {solved?.U != null && (
        <text x={cx + R + 13} y={cy - 14} textAnchor="middle"
          fontSize="6" fill="#3b82f6" fontWeight="bold">{fmt(solved.U)} V</text>
      )}

      {/* Vecteur I — tourne via CSS transition */}
      <g style={{
        transform: `rotate(${phiDeg}deg)`,
        transformOrigin: `${cx}px ${cy}px`,
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <Arrow x1={cx} y1={cy} x2={cx + iR} y2={cy} color="#10b981" />
      </g>

      {/* Label I positionné à la pointe calculée */}
      <circle cx={iLabelX} cy={iLabelY} r="9"
        fill={solveFor === "I" ? "#10b981" : "#064e3b"} />
      <text x={iLabelX} y={iLabelY + 3.5} textAnchor="middle"
        fontSize="8" fontWeight="bold" fill="white">I</text>
      {solved?.I != null && (
        <text x={iLabelX} y={iLabelY + 19} textAnchor="middle"
          fontSize="6" fill="#10b981" fontWeight="bold">{fmt(solved.I)} A</text>
      )}

      {/* Point origine */}
      <circle cx={cx} cy={cy} r="3.5" fill="#6b7280" />

      {/* Badge puissance P */}
      {solved?.P != null && (
        <g>
          <rect x={3} y={3} width={66} height={17} rx="4"
            fill="#1c1008" stroke="#92400e" strokeWidth="0.5" />
          <text x={36} y={15} textAnchor="middle" fontSize="7"
            fill="#f59e0b" fontWeight="bold">P = {fmt(solved.P)} W</text>
        </g>
      )}
    </svg>
  );
}
