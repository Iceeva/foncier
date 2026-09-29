import { CalendarEvent } from "react-bootstrap-icons";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MOTIF_RDV_LABELS, STATUT_RDV_LABELS } from "@/lib/domain/refs";
import { dateHeureFr } from "@/lib/format";
import FormulaireRdv from "./formulaire-rdv";
export default async function WidgetRdv({ parcelleId, proprietaireId }: { parcelleId: string; proprietaireId: string }) {
  const session = await auth();
  const rdv = await prisma.rdv.findMany({ where: { parcelleId }, orderBy: { date: "asc" } });
  const autresParties = session?.user ? await prisma.user.findMany({ where: { id: { not: session.user.id }, OR: [{ id: proprietaireId }, { role: { in: ["AGENT", "NOTAIRE", "GEOMETRE"] } }] }, select: { id: true, nom: true, role: true } }) : [];
  return (
    <section className="mt-6 rounded-lg border border-trait bg-carte p-4" aria-labelledby="t-rdv">
      <h2 id="t-rdv" className="flex items-center gap-2 text-lg font-bold text-encre"><CalendarEvent aria-hidden /> Rendez-vous liés à cette parcelle</h2>
      {rdv.length ? <ul className="mt-2 space-y-1 text-sm">{rdv.map((r) => <li key={r.id}>{MOTIF_RDV_LABELS[r.motif]} · {dateHeureFr(r.date)} — {STATUT_RDV_LABELS[r.statut]}</li>)}</ul> : <p className="mt-1 text-sm text-texte-doux">Aucun rendez-vous pour l&apos;instant.</p>}
      {session?.user ? (
        <details className="mt-3"><summary className="cursor-pointer font-bold text-vert">Proposer un rendez-vous</summary><FormulaireRdv parcelleId={parcelleId} autresParties={autresParties} /></details>
      ) : <p className="mt-3 text-sm text-texte-doux"><a href="/connexion" className="text-vert underline">Connectez-vous</a> pour proposer un rendez-vous.</p>}
    </section>
  );
}
