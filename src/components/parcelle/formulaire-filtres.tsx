"use client";
import { COMMUNES, USAGE_LABELS, STATUT_PARCELLE_LABELS } from "@/lib/domain/refs";
import type { CriteresRecherche } from "@/lib/domain/recherche";
const TRIS: Record<string, string> = { "": "Pertinence", prix_asc: "Prix croissant", prix_desc: "Prix décroissant", surface_asc: "Superficie croissante", surface_desc: "Superficie décroissante" };
export default function FormulaireFiltres({ criteres, vue }: { criteres: CriteresRecherche; vue: "liste" | "carte" }) {
  return (
    <form className="grid grid-cols-2 gap-4 rounded-lg border border-trait bg-carte p-4 sm:grid-cols-3 lg:grid-cols-5" method="get">
      <label className="col-span-2 flex flex-col gap-1 text-sm font-bold sm:col-span-3 lg:col-span-2">
        Recherche libre
        <input name="q" defaultValue={criteres.q ?? ""} placeholder="Quartier, numéro, mot-clé…" className="rounded-md border-2 border-trait px-3 py-2 font-normal" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold">Commune
        <select name="commune" defaultValue={criteres.commune ?? ""} className="rounded-md border-2 border-trait px-3 py-2 font-normal">
          <option value="">Toutes</option>{Object.keys(COMMUNES).map((c) => <option key={c} value={c}>{c}</option>)}
        </select></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Usage
        <select name="usage" defaultValue={criteres.usage ?? ""} className="rounded-md border-2 border-trait px-3 py-2 font-normal">
          <option value="">Tous</option>{Object.entries(USAGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Statut
        <select name="statut" defaultValue={criteres.statut ?? ""} className="rounded-md border-2 border-trait px-3 py-2 font-normal">
          <option value="">Tous</option>{Object.entries(STATUT_PARCELLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Impôts fonciers
        <select name="impot" defaultValue={criteres.impot ?? ""} className="rounded-md border-2 border-trait px-3 py-2 font-normal">
          <option value="">Indifférent</option><option value="oui">À jour</option><option value="non">Non à jour</option>
        </select></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Prix min (FCFA)
        <input name="prixMin" type="number" min={0} step={100000} defaultValue={criteres.prixMin ?? ""} className="rounded-md border-2 border-trait px-3 py-2 font-normal" /></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Prix max (FCFA)
        <input name="prixMax" type="number" min={0} step={100000} defaultValue={criteres.prixMax ?? ""} className="rounded-md border-2 border-trait px-3 py-2 font-normal" /></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Surface min (m²)
        <input name="surfMin" type="number" min={0} defaultValue={criteres.surfMin ?? ""} className="rounded-md border-2 border-trait px-3 py-2 font-normal" /></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Trier par
        <select name="tri" defaultValue={criteres.tri ?? ""} className="rounded-md border-2 border-trait px-3 py-2 font-normal">
          {Object.entries(TRIS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select></label>
      <input type="hidden" name="vue" value={vue} />
      <div className="col-span-2 flex items-end gap-2 sm:col-span-3 lg:col-span-5">
        <button type="submit" className="rounded-md border-2 border-encre bg-jaune px-4 py-2 font-bold text-encre">Filtrer</button>
        <a href="/parcelles" className="rounded-md border-2 border-encre bg-white px-4 py-2 font-bold text-encre">Réinitialiser</a>
      </div>
    </form>
  );
}
