import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigerRole } from "@/lib/session";
import { fcfa, m2 } from "@/lib/format";
import BadgeStatut from "@/components/parcelle/badge-statut";

export default async function TableauDeBordProprietaire() {
  const session = await exigerRole("PROPRIETAIRE");
  const parcelles = await prisma.parcelle.findMany({ where: { proprietaireId: session.user.id }, orderBy: { id: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold text-encre">Bienvenue, {session.user.name}</h1>
      <p className="mt-1 text-texte-doux">Mes terrains ({parcelles.length})</p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parcelles.map((p) => (
          <article key={p.id} className="rounded-lg border border-trait bg-carte p-4">
            <h3 className="font-bold"><Link href={`/parcelles/${p.id}`} className="text-vert hover:underline">{p.id} — {p.quartier}</Link></h3>
            <p className="mt-1 text-sm text-texte-doux">{m2(p.superficie)} · {p.prix ? fcfa(p.prix) : "Prix non renseigné"}</p>
            <div className="mt-2"><BadgeStatut statut={p.statut} /></div>
          </article>
        ))}
      </div>
    </div>
  );
}
