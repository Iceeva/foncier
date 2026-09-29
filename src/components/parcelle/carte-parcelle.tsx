import Link from "next/link";
import type { Parcelle } from "@/generated/prisma/client";
import { USAGE_LABELS } from "@/lib/domain/refs";
import { fcfa, m2 } from "@/lib/format";
import BadgeStatut from "./badge-statut";
import BadgeImpot from "./badge-impot";
type ParcelleAvecRelations = Parcelle & { commune: { nom: string }; impotsAJour: boolean };
export default function CarteParcelle({ p }: { p: ParcelleAvecRelations }) {
  return (
    <article className="rounded-lg border border-trait bg-carte p-4">
      <h3 className="font-bold"><Link href={`/parcelles/${p.id}`} className="text-vert hover:underline">{p.id} — {p.quartier}</Link></h3>
      <p className="mt-1 text-sm text-texte-doux">{p.commune.nom} · {USAGE_LABELS[p.usage]} · {m2(p.superficie)}</p>
      <p className="mt-1 font-bold text-encre">{p.prix ? fcfa(p.prix) : "Prix non renseigné"}</p>
      <div className="mt-2 flex flex-wrap gap-2"><BadgeStatut statut={p.statut} /><BadgeImpot aJour={p.impotsAJour} /></div>
    </article>
  );
}
