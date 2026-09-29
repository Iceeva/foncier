import type { Metadata } from "next";
import Link from "next/link";
import { ListUl, Map as MapIcon } from "react-bootstrap-icons";
import { prisma } from "@/lib/prisma";
import { lireCriteres, versWhereParcelle, versOrderBy, versQueryString } from "@/lib/domain/recherche";
import { impotsAJour } from "@/lib/domain/fiscalite";
import FormulaireFiltres from "@/components/parcelle/formulaire-filtres";
import CarteParcelle from "@/components/parcelle/carte-parcelle";
export const metadata: Metadata = { title: "Rechercher un terrain" };
export default async function PageParcelles({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const criteres = lireCriteres(sp);
  const vue = criteres.vue === "carte" ? "carte" : "liste";
  const parcelles = await prisma.parcelle.findMany({ where: versWhereParcelle(criteres), orderBy: versOrderBy(criteres.tri), include: { commune: true, documents: { where: { type: "QUITUS" }, select: { type: true, expire: true } } } });
  const avecImpots = parcelles.map((p) => ({ ...p, impotsAJour: impotsAJour(p.documents) }));
  return (
    <div>
      <h1 className="text-2xl font-bold text-encre">Rechercher un terrain</h1>
      <div className="mt-4"><FormulaireFiltres criteres={criteres} vue={vue} /></div>
      <div className="mt-4 flex items-center gap-2" role="group" aria-label="Mode d'affichage">
        <Link href={`/parcelles${versQueryString({ ...criteres, vue: "liste" })}`} className={`rounded-md border-2 border-encre px-3 py-1.5 text-sm font-bold ${vue === "liste" ? "bg-jaune" : "bg-white"}`}><ListUl className="me-1 inline" aria-hidden />Liste</Link>
        <Link href={`/parcelles${versQueryString({ ...criteres, vue: "carte" })}`} className={`rounded-md border-2 border-encre px-3 py-1.5 text-sm font-bold ${vue === "carte" ? "bg-jaune" : "bg-white"}`}><MapIcon className="me-1 inline" aria-hidden />Carte</Link>
        <Link href={`/carte${versQueryString(criteres)}`} className="ms-2 text-sm text-vert underline">Ouvrir la carte plein écran</Link>
      </div>
      <p className="mt-4 text-sm text-texte-doux" role="status"><strong>{avecImpots.length}</strong> parcelle(s) trouvée(s).</p>
      {avecImpots.length === 0 ? (
        <p className="mt-4 rounded-lg border-2 border-dashed border-trait bg-white p-6 text-center text-texte-doux">Aucun terrain ne correspond. Élargissez votre budget ou retirez un filtre.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{avecImpots.map((p) => <CarteParcelle key={p.id} p={p} />)}</div>
      )}
    </div>
  );
}
