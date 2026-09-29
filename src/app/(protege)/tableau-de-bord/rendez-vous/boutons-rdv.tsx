"use client";
import { useTransition } from "react";
import { changerStatutRdvAction } from "@/app/actions/rdv";
export default function BoutonsRdv({ rdvId, statut, estDemandeur }: { rdvId: string; statut: string; estDemandeur: boolean }) {
  const [enCours, start] = useTransition();
  const agir = (s: "CONFIRME" | "REFUSE" | "ANNULE") => start(() => changerStatutRdvAction(rdvId, s));
  return (
    <span className="flex gap-2">
      {statut === "PROPOSE" && !estDemandeur && (<><button disabled={enCours} onClick={() => agir("CONFIRME")} className="rounded-md border-2 border-encre bg-jaune px-3 py-1 text-sm font-bold">Confirmer</button><button disabled={enCours} onClick={() => agir("REFUSE")} className="rounded-md border-2 border-rouge px-3 py-1 text-sm font-bold text-rouge">Refuser</button></>)}
      {["PROPOSE", "CONFIRME"].includes(statut) && estDemandeur && <button disabled={enCours} onClick={() => agir("ANNULE")} className="rounded-md border-2 border-rouge px-3 py-1 text-sm font-bold text-rouge">Annuler</button>}
    </span>
  );
}
