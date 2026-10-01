import type { Metadata } from "next";
import { exigerRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { verifierChaine } from "@/lib/domain/audit";
import { dateHeureFr } from "@/lib/format";
export const metadata: Metadata = { title: "Journal d'audit" };
export default async function PageAudit() {
  await exigerRole("ADMIN", "AGENT");
  const [entrees, verif] = await Promise.all([prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 }), verifierChaine()]);
  return (
    <div>
      <h1 className="text-2xl font-bold text-encre">Journal d&apos;audit</h1>
      <p className={`mt-2 font-bold ${verif.intacte ? "text-vert-fonce" : "text-rouge"}`}>
        {verif.intacte ? "✅ Chaîne intacte : chaque entrée est liée à la précédente et signée Ed25519." : `🔴 Rupture détectée (${verif.premiereRuptureId}) : ${verif.motif}`}
      </p>
      <div className="mt-4 overflow-x-auto rounded-lg border border-trait">
        <table className="w-full border-collapse bg-carte text-sm">
          <thead className="bg-vert-clair text-left"><tr><th className="px-3 py-2">Date</th><th className="px-3 py-2">Action</th><th className="px-3 py-2">Détail</th><th className="px-3 py-2">Empreinte</th></tr></thead>
          <tbody>{entrees.map((e) => <tr key={e.id} className="border-t border-trait"><td className="px-3 py-2">{dateHeureFr(e.createdAt)}</td><td className="px-3 py-2">{e.action}</td><td className="px-3 py-2 text-xs">{JSON.stringify(e.details)}</td><td className="px-3 py-2 font-mono text-xs">{e.empreinte.slice(0, 12)}…</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
