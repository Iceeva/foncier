import type { Metadata } from "next";
import Link from "next/link";
import { CalendarEvent } from "react-bootstrap-icons";
import { prisma } from "@/lib/prisma";
import { exigerSession } from "@/lib/session";
import { MOTIF_RDV_LABELS, STATUT_RDV_LABELS } from "@/lib/domain/refs";
import { dateHeureFr } from "@/lib/format";
import BoutonsRdv from "./boutons-rdv";
export const metadata: Metadata = { title: "Mes rendez-vous" };
const COULEUR_STATUT: Record<string, string> = { PROPOSE: "border-jaune", CONFIRME: "border-vert", REFUSE: "border-rouge opacity-75", ANNULE: "border-rouge opacity-75", TERMINE: "border-texte-doux" };
export default async function PageRendezVous() {
  const session = await exigerSession();
  const rdv = await prisma.rdv.findMany({ where: { participants: { some: { userId: session.user.id } } }, include: { parcelle: { select: { id: true, quartier: true } }, participants: { include: { user: { select: { nom: true } } } } }, orderBy: { date: "asc" } });
  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold text-encre"><CalendarEvent aria-hidden /> Mes rendez-vous</h1>
      {rdv.length === 0 && <p className="mt-4 rounded-lg border-2 border-dashed border-trait bg-white p-6 text-center text-texte-doux">Aucun rendez-vous pour l&apos;instant. Proposez-en un depuis la fiche d&apos;une parcelle.</p>}
      <ul className="mt-4 space-y-3">
        {rdv.map((r) => (
          <li key={r.id} className={`rounded-lg border bg-carte border-l-4 p-4 ${COULEUR_STATUT[r.statut]}`}>
            <div className="font-bold">{MOTIF_RDV_LABELS[r.motif]} — <Link href={`/parcelles/${r.parcelle.id}`} className="text-vert underline">{r.parcelle.id}, {r.parcelle.quartier}</Link></div>
            <div className="text-sm text-texte-doux">{dateHeureFr(r.date)} · {r.lieu}</div>
            <div className="text-sm text-texte-doux">Participants : {r.participants.map((p) => p.user.nom).join(", ")}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2"><span className="font-bold">{STATUT_RDV_LABELS[r.statut]}</span><BoutonsRdv rdvId={r.id} statut={r.statut} estDemandeur={r.demandeurId === session.user.id} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
