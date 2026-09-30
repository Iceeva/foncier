"use client";
import { useActionState, useTransition } from "react";
import { mettreEnVenteAction, retirerDeVenteAction, signalerLitigeAction, leverLitigeAction } from "@/app/actions/gestion-parcelle";

type Props = { parcelleId: string; mode: "vendre" | "modifier" | "retirer" | "litige" | "lever"; prixActuel?: number | null };

export default function FormulaireGestion({ parcelleId, mode, prixActuel }: Props) {
  const [etat, action, enCours] = useActionState(async (_: { erreur?: string }, fd: FormData) => mettreEnVenteAction(fd), {});
  const [enCours2, start] = useTransition();

  if (mode === "vendre" || mode === "modifier") {
    return (
      <form action={action} className="mt-2 flex flex-wrap items-end gap-2">
        <input type="hidden" name="parcelleId" value={parcelleId} />
        <label className="flex flex-col gap-1 text-sm font-bold">
          Prix (FCFA)
          <input name="prix" type="number" min={0} step={100000} defaultValue={prixActuel ?? ""} placeholder="Prix demandé" className="rounded-md border-2 border-trait px-3 py-2 font-normal" />
        </label>
        <button type="submit" disabled={enCours} className="rounded-md border-2 border-encre bg-jaune px-4 py-2 font-bold text-encre disabled:opacity-60">
          {mode === "vendre" ? "Mettre en vente" : "Mettre à jour le prix"}
        </button>
        {etat.erreur && <p role="alert" className="w-full text-sm font-bold text-rouge">{etat.erreur}</p>}
      </form>
    );
  }
  if (mode === "retirer") {
    return <button disabled={enCours2} onClick={() => start(() => retirerDeVenteAction(parcelleId))} className="mt-2 rounded-md border-2 border-encre bg-white px-4 py-2 font-bold text-encre">Retirer de la vente</button>;
  }
  if (mode === "litige") {
    return (
      <button
        disabled={enCours2}
        onClick={() => { const motif = prompt("Décrivez brièvement le litige :"); if (motif) start(() => signalerLitigeAction(parcelleId, motif)); }}
        className="mt-2 rounded-md border-2 border-rouge px-4 py-2 font-bold text-rouge"
      >
        Signaler un litige sur ce terrain
      </button>
    );
  }
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-rouge">🔴 Ce terrain est signalé en litige.</p>
      <button disabled={enCours2} onClick={() => start(() => leverLitigeAction(parcelleId))} className="rounded-md border-2 border-encre bg-jaune px-4 py-2 font-bold text-encre">Lever le signalement de litige</button>
    </div>
  );
}
