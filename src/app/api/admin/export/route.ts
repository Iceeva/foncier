import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const champ = (v: unknown) => { const t = String(v ?? ""); return /[",\n;]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
const csv = (lignes: unknown[][]) => "\uFEFF" + lignes.map((l) => l.map(champ).join(";")).join("\n");

export async function GET(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ erreur: "Accès réservé aux administrateurs." }, { status: 403 });
  const type = new URL(request.url).searchParams.get("type");
  let corps: string;
  if (type === "parcelles") {
    const p = await prisma.parcelle.findMany({ include: { commune: true, proprietaire: true }, orderBy: { id: "asc" } });
    corps = csv([["Numéro", "Commune", "Quartier", "Superficie (m²)", "Prix (FCFA)", "Statut", "Propriétaire"], ...p.map((x) => [x.id, x.commune.nom, x.quartier, x.superficie, x.prix ?? "", x.statut, x.proprietaire.nom])]);
  } else if (type === "demandes") {
    const d = await prisma.demandeAchat.findMany({ include: { acheteur: true, agent: true }, orderBy: { createdAt: "desc" } });
    corps = csv([["Parcelle", "Acheteur", "Statut", "Agent", "Motif de rejet", "Déposée le"], ...d.map((x) => [x.parcelleId, x.acheteur.nom, x.statut, x.agent?.nom ?? "", x.motifRejet ?? "", x.createdAt.toISOString()])]);
  } else return NextResponse.json({ erreur: "Type d'export inconnu." }, { status: 400 });
  return new NextResponse(corps, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${type}.csv"` } });
}
