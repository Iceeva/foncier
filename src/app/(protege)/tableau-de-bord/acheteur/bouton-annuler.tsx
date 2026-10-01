"use client";
import { useTransition } from "react";
import { annulerDemandeAction } from "@/app/actions/demandes";
export default function BoutonAnnuler({ demandeId }: { demandeId: string }) {
  const [enCours, start] = useTransition();
  return <button disabled={enCours} onClick={() => start(() => annulerDemandeAction(demandeId))} className="mt-2 rounded-md border-2 border-rouge px-3 py-1 text-sm font-bold text-rouge">Annuler ma demande</button>;
}
