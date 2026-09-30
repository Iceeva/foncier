"use client";
import { useTransition, useState } from "react";
import { basculerControleAction, validerDemandeAction, rejeterDemandeAction } from "@/app/actions/demandes";
import { POINTS_CONTROLE, type Controle, type PointControle } from "@/lib/domain/controle";

export default function ActionsDemande({ demandeId, controle, complet }: { demandeId: string; controle: Controle; complet: boolean }) {
  const [enCours, start] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);

  const basculer = (point: PointControle) => start(() => basculerControleAction(demandeId, point));
  const valider = () => start(async () => { try { await validerDemandeAction(demandeId); } catch (e) { setErreur((e as Error).message); } });
  const rejeter = () => {
    const motif = prompt("Motif du rejet (obligatoire) :");
    if (!motif) return;
    start(async () => { try { await rejeterDemandeAction(demandeId, motif); } catch (e) { setErreur((e as Error).message); } });
  };

  return (
    <div className="mt-2">
      <ul className="space-y-1">
        {POINTS_CONTROLE.map((p) => (
          <li key={p.id}>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={Boolean(controle[p.id])} disabled={enCours} onChange={() => basculer(p.id)} className="mt-1" />
              {p.label}
            </label>
          </li>
        ))}
      </ul>
      {erreur && <p role="alert" className="mt-2 text-sm font-bold text-rouge">{erreur}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button disabled={enCours || !complet} onClick={valider} title={complet ? "" : "Cochez les 6 points de contrôle avant de valider"} className="rounded-md border-2 border-encre bg-jaune px-3 py-1.5 text-sm font-bold text-encre disabled:cursor-not-allowed disabled:opacity-50">
          Valider et transférer la propriété
        </button>
        <button disabled={enCours} onClick={rejeter} className="rounded-md border-2 border-rouge px-3 py-1.5 text-sm font-bold text-rouge">Rejeter</button>
      </div>
    </div>
  );
}
