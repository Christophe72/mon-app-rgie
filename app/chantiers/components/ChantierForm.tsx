"use client";

import { useState } from "react";
import {
  type Chantier,
  type TypeSupport,
  type StatutChantier,
  TYPE_SUPPORT_META,
  STATUT_META,
} from "../types";

type FormData = Omit<Chantier, "id" | "createdAt">;

interface Props {
  initial?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  submitLabel: string;
}

const INPUT = "bg-gray-800 rounded-lg px-3 py-2 text-white outline-none w-full text-sm";
const LABEL = "text-xs text-gray-400 uppercase tracking-widest font-semibold";
const TYPE_SUPPORTS = Object.keys(TYPE_SUPPORT_META) as TypeSupport[];
const STATUTS = Object.keys(STATUT_META) as StatutChantier[];

export default function ChantierForm({ initial, onSubmit, submitLabel }: Props) {
  const [nom,         setNom]         = useState(initial?.nom         ?? "");
  const [adresse,     setAdresse]     = useState(initial?.adresse     ?? "");
  const [ville,       setVille]       = useState(initial?.ville       ?? "");
  const [codePostal,  setCodePostal]  = useState(initial?.codePostal  ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [statut,      setStatut]      = useState<StatutChantier>(initial?.statut ?? "EN_ATTENTE");
  const [datePrevue,  setDatePrevue]  = useState(initial?.datePrevue  ?? "");
  const [typeSupport, setTypeSupport] = useState<TypeSupport[]>(initial?.typeSupport ?? ["BLOC"]);
  const [contraintes, setContraintes] = useState(initial?.contraintes ?? "");
  const [error,       setError]       = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !datePrevue) {
      setError("Le nom et la date prévue sont requis.");
      return;
    }
    if (typeSupport.length === 0) {
      setError("Sélectionne au moins un type de support.");
      return;
    }
    setError("");
    onSubmit({
      nom:         nom.trim(),
      adresse:     adresse.trim(),
      ville:       ville.trim(),
      codePostal:  codePostal.trim(),
      description: description.trim(),
      statut,
      datePrevue,
      typeSupport,
      contraintes: contraintes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Informations principales */}
      <div className="bg-gray-900 rounded-xl p-4 space-y-3">
        <p className={LABEL}>Informations</p>
        <div className="space-y-1.5">
          <label className={LABEL}>Nom du chantier *</label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)}
            placeholder="Ex : Villa Dupont" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Adresse</label>
          <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)}
            placeholder="Ex : Rue des Lilas 12" className={INPUT} />
        </div>
        <div className="flex gap-2">
          <div className="flex-1 space-y-1.5">
            <label className={LABEL}>Ville</label>
            <input type="text" value={ville} onChange={(e) => setVille(e.target.value)}
              placeholder="Ex : Liège" className={INPUT} />
          </div>
          <div className="w-28 space-y-1.5">
            <label className={LABEL}>Code postal</label>
            <input type="text" value={codePostal} onChange={(e) => setCodePostal(e.target.value)}
              placeholder="4000" className={INPUT} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Nature des travaux, contexte..." rows={2}
            className={`${INPUT} resize-none`} />
        </div>
        <div className="flex gap-2">
          <div className="flex-1 space-y-1.5">
            <label className={LABEL}>Statut</label>
            <select value={statut} onChange={(e) => setStatut(e.target.value as StatutChantier)}
              className={`${INPUT} cursor-pointer`}>
              {STATUTS.map((s) => (
                <option key={s} value={s}>{STATUT_META[s].label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 space-y-1.5">
            <label className={LABEL}>Date prévue *</label>
            <input type="date" value={datePrevue} onChange={(e) => setDatePrevue(e.target.value)}
              className={INPUT} />
          </div>
        </div>
      </div>

      {/* Type de support */}
      <div className="bg-gray-900 rounded-xl p-4 space-y-3">
        <p className={LABEL}>Type de support</p>
        <div className="grid grid-cols-2 gap-2">
          {TYPE_SUPPORTS.map((ts) => {
            const meta = TYPE_SUPPORT_META[ts];
            const active = typeSupport.includes(ts);
            const toggle = () =>
              setTypeSupport((prev) =>
                active ? prev.filter((t) => t !== ts) : [...prev, ts]
              );
            return (
              <button key={ts} type="button" onClick={toggle}
                className={`text-left rounded-xl px-3 py-3 border transition-all ${
                  active
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
                }`}>
                <span className="block text-sm font-semibold">{meta.label}</span>
                <span className="block text-[10px] text-gray-500 mt-0.5 leading-snug">{meta.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contraintes */}
      <div className="bg-gray-900 rounded-xl p-4 space-y-1.5">
        <label className={LABEL}>
          Contraintes <span className="normal-case text-gray-600">(optionnel)</span>
        </label>
        <textarea value={contraintes} onChange={(e) => setContraintes(e.target.value)}
          placeholder="Ex : accès difficile, hauteur, faux plafond, local occupé..."
          rows={3} className={`${INPUT} resize-none`} />
      </div>

      {error && <p className="text-red-400 text-sm px-1">{error}</p>}

      <button type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg px-4 py-3 font-semibold text-white transition-all">
        {submitLabel}
      </button>

    </form>
  );
}
