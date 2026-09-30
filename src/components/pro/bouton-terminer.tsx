"use client";
import { useTransition } from "react";
import { terminerRdvAction } from "@/app/actions/documents-pro";
export default function BoutonTerminer({ rdvId }: { rdvId: string }) {
  const [enCours, start] = useTransition();
  return <button disabled={enCours} onClick={() => start(() => terminerRdvAction(rdvId))} className="mt-1 rounded-md border-2 border-encre bg-white px-3 py-1 text-sm font-bold">Marquer comme terminé</button>;
}
