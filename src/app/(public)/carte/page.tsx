import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { lireCriteres, versWhereParcelle, versQueryString } from "@/lib/domain/recherche";
import { impotsAJour } from "@/lib/domain/fiscalite";
import CarteParcelles from "@/components/carte/carte-parcelles-chargement";
import BadgeStatut from "@/components/parcelle/badge-statut";
import BadgeImpot from "@/components/parcelle/badge-impot";
import type { ParcelleCarte } from "@/components/carte/carte-parcelles";
export const metadata: Metadata = { title: "Carte des parcelles" };
export default async function PageCarte({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const criteres = lireCriteres(sp);
  const parcelles = await prisma.parcelle.findMany({ where: versWhereParcelle(criteres), include: { commune: true, documents: { where: { type: "QUITUS" }, select: { type: true, expire: true } } } });
  const avecImpots = parcelles.map((p) => ({ ...p, impotsAJour: impotsAJour(p.documents) }));
  const donneesCarte: ParcelleCarte[] = avecImpots.map((p) => ({ id: p.id, quartier: p.quartier, polygone: p.polygone as [number, number][], statut: p.statut, usage: p.usage, superficie: p.superficie, prix: p.prix }));
  const filtresActifs = Object.keys(criteres).filter((k) => k !== "vue").length;
  return (
    <div>
      <h1 className="text-2xl font-bold text-encre">Carte des parcelles</h1>
      <p className="mt-1 text-texte-doux">{avecImpots.length} parcelle(s) affichée(s){filtresActifs ? <> avec {filtresActifs} filtre(s) actif(s). <Link href={`/parcelles${versQueryString(criteres)}`} className="text-vert underline">Modifier les filtres</Link></> : "."}</p>
      <div className="mt-4"><CarteParcelles parcelles={donneesCarte} /></div>
      <h2 className="mt-6 text-lg font-bold text-encre">Liste des parcelles affichées</h2>
      <ul className="mt-2 space-y-2">
        {avecImpots.map((p) => <li key={p.id} className="flex flex-wrap items-center gap-2"><Link href={`/parcelles/${p.id}`} className="font-bold text-vert hover:underline">{p.id} - {p.quartier}, {p.commune.nom}</Link><BadgeStatut statut={p.statut} /><BadgeImpot aJour={p.impotsAJour} /></li>)}
      </ul>
    </div>
  );
}
