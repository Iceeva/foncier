"use client";
import { useTransition } from "react";
import { marquerToutLuAction } from "@/app/actions/notifications";
export default function BoutonToutLu() {
  const [enCours, start] = useTransition();
  return <button disabled={enCours} onClick={() => start(() => marquerToutLuAction())} className="rounded-md border-2 border-encre bg-white px-3 py-1.5 text-sm font-bold text-encre">Tout marquer comme lu</button>;
}
