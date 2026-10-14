import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, GeoAlt } from "react-bootstrap-icons";
import { prisma } from "@/lib/prisma";
import { impotsAJour } from "@/lib/domain/fiscalite";
import { analyserConformite, parcellesChevauchantes } from "@/lib/domain/conformite";
import { USAGE_LABELS, TYPE_DOCUMENT_LABELS } from "@/lib/domain/refs";
import { fcfa, m2, dateFr } from "@/lib/format";
import BadgeStatut from "@/components/parcelle/badge-statut";
import BadgeImpot from "@/components/parcelle/badge-impot";
import WidgetConformite from "@/components/parcelle/widget-conformite";
import WidgetRdv from "@/components/parcelle/widget-rdv";
import WidgetDemande from "@/components/parcelle/widget-demande";
import WidgetGestionProprietaire from "@/components/parcelle/widget-gestion-proprietaire";
import CarteParcelles from "@/components/carte/carte-parcelles-chargement";
import type { Point } from "@/lib/domain/geo";

type Props = { params: Promise<{ id: string }> };
async function getParcelle(id: string) {
  return prisma.parcelle.findUnique({ where: { id }, include: { commune: true, proprietaire: { select: { nom: true, telephone: true } }, documents: { include: { titulaire: { select: { nom: true } } }, orderBy: { date: "asc" } } } });
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params; const p = await getParcelle(id);
  return { title: p ? `${p.id} - ${p.quartier}` : "Parcelle introuvable" };
}
export default async function PageFicheParcelle({ params }: Props) {
  const { id } = await params; const p = await getParcelle(id);
  if (!p) notFound();
  const voisines = await prisma.parcelle.findMany({ where: { communeId: p.communeId, lat: { gte: p.lat - 0.005, lte: p.lat + 0.005 }, lng: { gte: p.lng - 0.005, lte: p.lng + 0.005 } } });
  const chevauche = parcellesChevauchantes({ id: p.id, polygone: p.polygone as Point[] }, voisines.map((v) => ({ id: v.id, polygone: v.polygone as Point[] })));
  const anomalies = analyserConformite(p, p.documents);
  return (
    <div>
      <p><Link href="/parcelles" className="inline-flex items-center gap-1 text-sm text-vert hover:underline"><ArrowLeft aria-hidden /> Toutes les parcelles</Link></p>
      <h1 className="mt-2 flex flex-wrap items-center gap-2 text-2xl font-bold text-encre">{p.id} - {p.quartier}, {p.commune.nom}<BadgeStatut statut={p.statut} /></h1>
      <p className="mt-2 text-texte-doux">{p.description}</p>
      <dl className="mt-4 grid grid-cols-2 gap-4 rounded-lg border border-trait bg-carte p-4 sm:grid-cols-4">
        <div><dt className="text-sm text-texte-doux">Usage</dt><dd className="font-bold">{USAGE_LABELS[p.usage]}</dd></div>
        <div><dt className="text-sm text-texte-doux">Superficie</dt><dd className="font-bold">{m2(p.superficie)}</dd></div>
        <div><dt className="text-sm text-texte-doux">Prix demandé</dt><dd className="font-bold">{p.prix ? fcfa(p.prix) : "Non renseigné"}</dd></div>
        <div><dt className="text-sm text-texte-doux">Propriétaire enregistré</dt><dd className="font-bold">{p.proprietaire.nom}</dd></div>
      </dl>
      <section className="mt-6" aria-labelledby="t-localisation">
        <h2 id="t-localisation" className="flex items-center gap-2 text-lg font-bold text-encre"><GeoAlt aria-hidden /> Localisation</h2>
        <div className="mt-2"><CarteParcelles focusId={p.id} parcelles={voisines.map((v) => ({ id: v.id, quartier: v.quartier, polygone: v.polygone as [number, number][], statut: v.statut, usage: v.usage, superficie: v.superficie, prix: v.prix }))} /></div>
      </section>
      <WidgetConformite anomalies={anomalies} chevauche={chevauche} />
      <section className="mt-6" aria-labelledby="t-docs">
        <h2 id="t-docs" className="text-lg font-bold text-encre">Documents fonciers ({p.documents.length})</h2>
        <p className="mt-1"><BadgeImpot aJour={impotsAJour(p.documents)} /></p>
        <div className="mt-2 overflow-x-auto rounded-lg border border-trait">
          <table className="w-full border-collapse bg-carte text-sm">
            <thead className="bg-vert-clair text-left"><tr><th className="px-3 py-2">Type</th><th className="px-3 py-2">Numéro</th><th className="px-3 py-2">Titulaire</th><th className="px-3 py-2">Date</th><th className="px-3 py-2">Statut</th><th className="px-3 py-2" /></tr></thead>
            <tbody>{p.documents.map((d) => (
              <tr key={d.id} className="border-t border-trait">
                <td className="px-3 py-2">{TYPE_DOCUMENT_LABELS[d.type].label}</td><td className="px-3 py-2 font-mono text-xs">{d.numero}</td>
                <td className="px-3 py-2">{d.titulaire.nom}</td><td className="px-3 py-2">{dateFr(d.date)}</td><td className="px-3 py-2">{d.statut}</td>
                <td className="px-3 py-2"><Link href={`/documents/${d.id}`} className="text-vert underline">Consulter</Link></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <p className="mt-2 text-sm"><Link href="/verification-andf" className="text-vert underline">Vérifier un numéro de document auprès de la base ANDF (simulation)</Link></p>
      </section>
      <WidgetGestionProprietaire parcelleId={p.id} proprietaireId={p.proprietaireId} statut={p.statut} prix={p.prix} />

      <WidgetDemande parcelleId={p.id} statut={p.statut} prix={p.prix} />

      <WidgetRdv parcelleId={p.id} proprietaireId={p.proprietaireId} />
    </div>
  );
}
