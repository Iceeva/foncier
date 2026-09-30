import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MOTIF_RDV_LABELS, TYPE_DOCUMENT_LABELS } from "@/lib/domain/refs";
import { dateHeureFr } from "@/lib/format";
import FormulairePiece from "./formulaire-piece";
import BoutonTerminer from "./bouton-terminer";

const TYPE_PAR_ROLE = { GEOMETRE: "BORNAGE", NOTAIRE: "ACTE_NOTARIE" } as const;

export default async function EspaceProfessionnel({ userId, role }: { userId: string; role: "NOTAIRE" | "GEOMETRE" }) {
  const rdv = await prisma.rdv.findMany({
    where: { statut: "CONFIRME", participants: { some: { userId } } },
    include: { parcelle: { select: { id: true, quartier: true } } },
    orderBy: { date: "asc" },
  });
  const parcelles = await prisma.parcelle.findMany({ select: { id: true, quartier: true }, orderBy: { id: "asc" } });
  const type = TYPE_PAR_ROLE[role];

  return (
    <div>
      <h2 className="mt-6 text-lg font-bold text-encre">Rendez-vous confirmés à venir ({rdv.length})</h2>
      {rdv.length === 0 ? (
        <p className="mt-2 rounded-lg border-2 border-dashed border-trait bg-white p-6 text-center text-texte-doux">Aucun rendez-vous confirmé pour l&apos;instant.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {rdv.map((r) => (
            <li key={r.id} className="rounded-lg border border-vert border-l-4 bg-carte p-3">
              <div><strong>{MOTIF_RDV_LABELS[r.motif]}</strong> — <Link href={`/parcelles/${r.parcelle.id}`} className="text-vert underline">{r.parcelle.id}, {r.parcelle.quartier}</Link></div>
              <div className="text-sm text-texte-doux">{dateHeureFr(r.date)} · {r.lieu}</div>
              <BoutonTerminer rdvId={r.id} />
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-lg font-bold text-encre">Déposer {TYPE_DOCUMENT_LABELS[type].label.toLowerCase()}</h2>
      <FormulairePiece parcelles={parcelles} />
    </div>
  );
}
