import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "react-bootstrap-icons";
import { prisma } from "@/lib/prisma";
import { exigerRole } from "@/lib/session";
import { analyserConformite, estAchetable } from "@/lib/domain/conformite";
import { POINTS_CONTROLE, controleComplet, type Controle } from "@/lib/domain/controle";
import { fcfa, dateHeureFr } from "@/lib/format";
import { STATUT_DEMANDE_LABELS } from "@/lib/domain/refs";
import ActionsDemande from "./actions-demande";

export const metadata: Metadata = { title: "Espace agent foncier" };

export default async function TableauDeBordAgent() {
  const session = await exigerRole("AGENT", "ADMIN");

  const enAttente = await prisma.demandeAchat.findMany({
    where: { statut: "EN_ATTENTE" },
    include: { parcelle: { include: { documents: true } }, acheteur: { select: { nom: true } } },
    orderBy: { createdAt: "asc" },
  });
  const traitees = await prisma.demandeAchat.findMany({
    where: { statut: { in: ["VALIDEE", "REJETEE"] } },
    include: { parcelle: { select: { id: true } }, agent: { select: { nom: true } } },
    orderBy: { decisionLe: "desc" },
    take: 10,
  });

  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold text-encre"><ShieldCheck aria-hidden /> Espace agent foncier</h1>
      <p className="mt-1 text-texte-doux">Bienvenue, {session.user.name}. Toute demande doit être intégralement contrôlée avant toute décision.</p>

      <h2 className="mt-6 text-lg font-bold text-encre">À instruire ({enAttente.length})</h2>
      {enAttente.length === 0 && <p className="mt-2 rounded-lg border-2 border-dashed border-trait bg-white p-6 text-center text-texte-doux">Aucune demande en attente.</p>}
      <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {enAttente.map((d) => {
          const anomalies = analyserConformite(d.parcelle, d.parcelle.documents);
          const ok = estAchetable(anomalies);
          const controle = (d.controle as Controle) ?? {};
          const complet = controleComplet(controle);
          return (
            <article key={d.id} className="rounded-lg border border-trait bg-carte p-4">
              <h3 className="font-bold"><Link href={`/parcelles/${d.parcelle.id}`} className="text-vert underline">{d.parcelle.id}</Link> - {fcfa(d.parcelle.prix)}</h3>
              <p className="text-sm text-texte-doux">Acheteur : {d.acheteur.nom} · Déposée le {dateHeureFr(d.createdAt)}</p>
              <p className={`mt-1 text-sm font-bold ${ok ? "text-vert-fonce" : "text-rouge"}`}>{ok ? "✅ Documents conformes" : `🔴 ${anomalies.length} anomalie(s)`}</p>
              {anomalies.length > 0 && (
                <ul className="mt-1 space-y-1 text-xs">{anomalies.slice(0, 3).map((a) => <li key={a.code} className="text-texte-doux">• {a.message}</li>)}</ul>
              )}
              <details open className="mt-3">
                <summary className="cursor-pointer text-sm font-bold">Contrôle approfondi ({Object.values(controle).filter(Boolean).length}/{POINTS_CONTROLE.length})</summary>
                <ActionsDemande demandeId={d.id} controle={controle} complet={complet} />
              </details>
            </article>
          );
        })}
      </div>

      <h2 className="mt-8 text-lg font-bold text-encre">Dernières décisions</h2>
      <div className="mt-2 overflow-x-auto rounded-lg border border-trait">
        <table className="w-full border-collapse bg-carte text-sm">
          <thead className="bg-vert-clair text-left"><tr><th className="px-3 py-2">Parcelle</th><th className="px-3 py-2">Décision</th><th className="px-3 py-2">Agent</th></tr></thead>
          <tbody>{traitees.map((d) => <tr key={d.id} className="border-t border-trait"><td className="px-3 py-2">{d.parcelle.id}</td><td className="px-3 py-2">{STATUT_DEMANDE_LABELS[d.statut]}</td><td className="px-3 py-2">{d.agent?.nom}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
