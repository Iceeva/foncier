"use client";
import { useActionState } from "react";
import { deposerDemandeAction } from "@/app/actions/demandes";
export default function FormulaireDemande({ parcelleId }: { parcelleId: string }) {
  const [etat, action, enCours] = useActionState(async (_: { erreur?: string }, fd: FormData) => deposerDemandeAction(fd), {});
  return (
    <form action={action} className="mt-3">
      <input type="hidden" name="parcelleId" value={parcelleId} />
      {etat.erreur && <p role="alert" className="mb-2 text-sm font-bold text-rouge">{etat.erreur}</p>}
      <button type="submit" disabled={enCours} className="rounded-md border-2 border-encre bg-jaune px-4 py-2 font-bold text-encre disabled:opacity-60">
        {enCours ? "Envoi…" : "Déposer une demande d'achat"}
      </button>
    </form>
  );
}
