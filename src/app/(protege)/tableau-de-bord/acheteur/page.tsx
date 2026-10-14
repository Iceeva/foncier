import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigerRole } from "@/lib/session";
import { STATUT_DEMANDE_LABELS } from "@/lib/domain/refs";
import { dateHeureFr, fcfa } from "@/lib/format";
import BoutonAnnuler from "./bouton-annuler";

export default async function TableauDeBordAcheteur() {
  const session = await exigerRole("ACHETEUR");
  const demandes = await prisma.demandeAchat.findMany({ where: { acheteurId: session.user.id }, include: { parcelle: true }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold text-encre">Bienvenue, {session.user.name}</h1>
      <p className="mt-1 text-texte-doux">Mes demandes d&apos;achat ({demandes.length}) - <Link href="/parcelles" className="text-vert underline">rechercher un terrain</Link></p>
      {demandes.length === 0 && <p className="mt-4 rounded-lg border-2 border-dashed border-trait bg-white p-6 text-center text-texte-doux">Aucune demande pour l&apos;instant.</p>}
      <ul className="mt-4 space-y-3">
        {demandes.map((d) => (
          <li key={d.id} className="rounded-lg border border-trait bg-carte p-4">
            <div className="font-bold"><Link href={`/parcelles/${d.parcelleId}`} className="text-vert underline">{d.parcelleId}</Link> - {fcfa(d.parcelle.prix)}</div>
            <div className="text-sm text-texte-doux">Déposée le {dateHeureFr(d.createdAt)}</div>
            <div className="mt-1 font-bold">{STATUT_DEMANDE_LABELS[d.statut]}</div>
            {d.motifRejet && <div className="text-sm text-rouge">Motif : {d.motifRejet}</div>}
            {d.statut === "EN_ATTENTE" && <BoutonAnnuler demandeId={d.id} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
