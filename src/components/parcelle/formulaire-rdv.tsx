"use client";
import { useActionState } from "react";
import { proposerRdvAction } from "@/app/actions/rdv";
import { MOTIF_RDV_LABELS } from "@/lib/domain/refs";
type Props = { parcelleId: string; autresParties: { id: string; nom: string; role: string }[] };
export default function FormulaireRdv({ parcelleId, autresParties }: Props) {
  const [etat, action, enCours] = useActionState(async (_: { erreur?: string }, fd: FormData) => proposerRdvAction(fd), {});
  return (
    <form action={action} className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <input type="hidden" name="parcelleId" value={parcelleId} />
      <label className="flex flex-col gap-1 text-sm font-bold">Motif<select name="motif" className="rounded-md border-2 border-trait px-3 py-2 font-normal">{Object.entries(MOTIF_RDV_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Avec<select name="avecUserId" className="rounded-md border-2 border-trait px-3 py-2 font-normal">{autresParties.map((u) => <option key={u.id} value={u.id}>{u.nom} — {u.role}</option>)}</select></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Date et heure<input name="date" type="datetime-local" required className="rounded-md border-2 border-trait px-3 py-2 font-normal" /></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Lieu<input name="lieu" required placeholder="Sur place, bureau…" className="rounded-md border-2 border-trait px-3 py-2 font-normal" /></label>
      {etat.erreur && <p role="alert" className="col-span-2 text-sm font-bold text-rouge">{etat.erreur}</p>}
      <button type="submit" disabled={enCours} className="col-span-2 w-fit rounded-md border-2 border-encre bg-jaune px-4 py-2 font-bold text-encre disabled:opacity-60">{enCours ? "Envoi…" : "Envoyer la proposition"}</button>
    </form>
  );
}
