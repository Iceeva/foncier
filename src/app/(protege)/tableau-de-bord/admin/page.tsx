import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigerRole } from "@/lib/session";
import { ROLE_LABELS, STATUT_PARCELLE_LABELS } from "@/lib/domain/refs";
import { fcfa } from "@/lib/format";

export default async function TableauDeBordAdmin() {
  const session = await exigerRole("ADMIN");
  const [parcelles, users, demandes, documents, parStatut, parRole, volume] = await Promise.all([
    prisma.parcelle.count(), prisma.user.count(), prisma.demandeAchat.count(), prisma.document.count(),
    prisma.parcelle.groupBy({ by: ["statut"], _count: true }),
    prisma.user.groupBy({ by: ["role"], _count: true }),
    prisma.parcelle.aggregate({ _sum: { prix: true }, where: { statut: "EN_VENTE" } }),
  ]);
  const Barres = ({ data }: { data: { label: string; n: number }[] }) => {
    const max = Math.max(1, ...data.map((d) => d.n));
    return <ul className="space-y-2">{data.map((d) => <li key={d.label} className="grid grid-cols-[9rem_1fr_2rem] items-center gap-2 text-sm"><span>{d.label}</span><span className="h-3 overflow-hidden rounded-full bg-vert-clair"><span className="block h-full rounded-full bg-vert" style={{ width: `${(d.n / max) * 100}%` }} /></span><b className="text-right">{d.n}</b></li>)}</ul>;
  };
  return (
    <div>
      <h1 className="text-2xl font-bold text-encre">Tableau de bord — {session.user.name}</h1>
      <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[["Parcelles", parcelles], ["Utilisateurs", users], ["Documents signés", documents], ["Demandes d'achat", demandes]].map(([l, n]) => (
          <li key={l as string} className="rounded-lg border border-trait bg-carte p-4"><strong className="block text-3xl text-vert">{n}</strong>{l}</li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-texte-doux">Valeur affichée des terrains en vente : {fcfa(volume._sum.prix)} (information seule, aucun paiement traité).</p>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-trait bg-carte p-4"><h2 className="mb-3 font-bold">Parcelles par statut</h2><Barres data={parStatut.map((s) => ({ label: STATUT_PARCELLE_LABELS[s.statut].label, n: s._count }))} /></section>
        <section className="rounded-lg border border-trait bg-carte p-4"><h2 className="mb-3 font-bold">Utilisateurs par rôle</h2><Barres data={parRole.map((r) => ({ label: ROLE_LABELS[r.role].label, n: r._count }))} /></section>
      </div>
      <section className="mt-6 rounded-lg border border-trait bg-carte p-4">
        <h2 className="font-bold">Exports et supervision</h2>
        <p className="mt-2 flex flex-wrap gap-2">
          <a href="/api/admin/export?type=parcelles" className="rounded-md border-2 border-encre bg-white px-3 py-1.5 text-sm font-bold">⬇️ Parcelles (CSV)</a>
          <a href="/api/admin/export?type=demandes" className="rounded-md border-2 border-encre bg-white px-3 py-1.5 text-sm font-bold">⬇️ Demandes d&apos;achat (CSV)</a>
          <Link href="/tableau-de-bord/audit" className="rounded-md border-2 border-encre bg-jaune px-3 py-1.5 text-sm font-bold">Journal d&apos;audit signé</Link>
        </p>
      </section>
    </div>
  );
}
