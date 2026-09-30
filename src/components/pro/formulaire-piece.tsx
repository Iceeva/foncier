"use client";
import { useActionState } from "react";
import { deposerPieceAction } from "@/app/actions/documents-pro";
export default function FormulairePiece({ parcelles }: { parcelles: { id: string; quartier: string }[] }) {
  const [etat, action, enCours] = useActionState(async (_: { erreur?: string }, fd: FormData) => deposerPieceAction(fd), {});
  return (
    <form action={action} className="mt-2 grid grid-cols-1 gap-3 rounded-lg border border-trait bg-carte p-4 sm:grid-cols-3">
      <label className="flex flex-col gap-1 text-sm font-bold">Parcelle
        <select name="parcelleId" className="rounded-md border-2 border-trait px-3 py-2 font-normal">{parcelles.map((p) => <option key={p.id} value={p.id}>{p.id} — {p.quartier}</option>)}</select></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Numéro de pièce<input name="numero" required placeholder="BN-00099-COT" className="rounded-md border-2 border-trait px-3 py-2 font-normal" /></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Date<input name="date" type="date" required className="rounded-md border-2 border-trait px-3 py-2 font-normal" /></label>
      {etat.erreur && <p role="alert" className="col-span-3 text-sm font-bold text-rouge">{etat.erreur}</p>}
      <button type="submit" disabled={enCours} className="col-span-3 w-fit rounded-md border-2 border-encre bg-jaune px-4 py-2 font-bold text-encre disabled:opacity-60">{enCours ? "Dépôt…" : "Déposer la pièce (signée par la plateforme)"}</button>
    </form>
  );
}
