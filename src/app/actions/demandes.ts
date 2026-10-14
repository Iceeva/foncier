"use server";
// Actions serveur - demandes d'achat. Remplace le paiement : aucune somme
// n'est jamais traitée. Un agent foncier instruit chaque demande avec une
// checklist obligatoire en 6 points avant de valider ou de rejeter.
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { exigerSession, exigerRole } from "@/lib/session";
import { notifier } from "@/lib/domain/notifications";
import { controleComplet, POINTS_CONTROLE, type Controle, type PointControle } from "@/lib/domain/controle";
import { journaliser } from "@/lib/domain/audit";

export async function deposerDemandeAction(formData: FormData): Promise<{ erreur?: string }> {
  const session = await exigerSession();
  if (session.user.role !== "ACHETEUR") return { erreur: "Seul un acheteur peut déposer une demande d'achat." };
  const parcelleId = String(formData.get("parcelleId") ?? "");
  const parcelle = await prisma.parcelle.findUnique({ where: { id: parcelleId } });
  if (!parcelle) return { erreur: "Parcelle introuvable." };
  if (parcelle.statut !== "EN_VENTE") return { erreur: "Cette parcelle n'est pas en vente." };
  if (parcelle.proprietaireId === session.user.id) return { erreur: "Vous ne pouvez pas acheter votre propre terrain." };
  const existante = await prisma.demandeAchat.findFirst({ where: { parcelleId, statut: "EN_ATTENTE" } });
  if (existante) return { erreur: "Une demande est déjà en cours d'instruction sur cette parcelle." };

  const demande = await prisma.demandeAchat.create({ data: { parcelleId, acheteurId: session.user.id } });
  await prisma.parcelle.update({ where: { id: parcelleId }, data: { statut: "EN_COURS" } });
  const agents = await prisma.user.findMany({ where: { role: "AGENT" }, select: { id: true } });
  await notifier([parcelle.proprietaireId, ...agents.map((a) => a.id)], `Nouvelle demande d'achat pour la parcelle ${parcelleId}.`, "/tableau-de-bord/agent");
  await journaliser("demande_deposee", { demandeId: demande.id, parcelleId, acheteurId: session.user.id });
  revalidatePath(`/parcelles/${parcelleId}`);
  return {};
}

export async function annulerDemandeAction(demandeId: string) {
  const session = await exigerSession();
  const demande = await prisma.demandeAchat.findUnique({ where: { id: demandeId } });
  if (!demande || demande.acheteurId !== session.user.id) throw new Error("Demande introuvable.");
  if (demande.statut !== "EN_ATTENTE") throw new Error("Cette demande a déjà été traitée.");
  await prisma.demandeAchat.update({ where: { id: demandeId }, data: { statut: "ANNULEE" } });
  await prisma.parcelle.update({ where: { id: demande.parcelleId }, data: { statut: "EN_VENTE" } });
  revalidatePath(`/parcelles/${demande.parcelleId}`); revalidatePath("/tableau-de-bord/agent");
}

export async function basculerControleAction(demandeId: string, point: PointControle) {
  await exigerRole("AGENT", "ADMIN");
  const demande = await prisma.demandeAchat.findUnique({ where: { id: demandeId } });
  if (!demande) throw new Error("Demande introuvable.");
  const controle = (demande.controle as Controle) ?? {};
  controle[point] = !controle[point];
  await prisma.demandeAchat.update({ where: { id: demandeId }, data: { controle } });
  revalidatePath("/tableau-de-bord/agent");
}

export async function validerDemandeAction(demandeId: string) {
  const session = await exigerRole("AGENT", "ADMIN");
  const demande = await prisma.demandeAchat.findUnique({ where: { id: demandeId }, include: { parcelle: true } });
  if (!demande) throw new Error("Demande introuvable.");
  if (demande.statut !== "EN_ATTENTE") throw new Error("Cette demande a déjà été traitée.");
  if (!controleComplet((demande.controle as Controle) ?? {})) throw new Error("Le contrôle approfondi n'est pas complet (6 points requis).");

  // Transaction : validation de la demande + transfert de propriété, de façon atomique.
  await prisma.$transaction([
    prisma.demandeAchat.update({ where: { id: demandeId }, data: { statut: "VALIDEE", agentId: session.user.id, decisionLe: new Date() } }),
    prisma.parcelle.update({ where: { id: demande.parcelleId }, data: { statut: "HORS_VENTE", proprietaireId: demande.acheteurId, prix: null } }),
  ]);
  await notifier([demande.acheteurId, demande.parcelle.proprietaireId], `Demande d'achat validée pour ${demande.parcelleId} : la propriété a été transférée.`, "/tableau-de-bord");
  await journaliser("demande_validee", { demandeId, parcelleId: demande.parcelleId, agentId: session.user.id, nouveauProprietaireId: demande.acheteurId });
  revalidatePath(`/parcelles/${demande.parcelleId}`); revalidatePath("/tableau-de-bord/agent");
}

export async function rejeterDemandeAction(demandeId: string, motif: string) {
  const session = await exigerRole("AGENT", "ADMIN");
  const demande = await prisma.demandeAchat.findUnique({ where: { id: demandeId }, include: { parcelle: true } });
  if (!demande) throw new Error("Demande introuvable.");
  if (demande.statut !== "EN_ATTENTE") throw new Error("Cette demande a déjà été traitée.");
  if (!motif.trim()) throw new Error("Un motif de rejet est obligatoire.");

  await prisma.$transaction([
    prisma.demandeAchat.update({ where: { id: demandeId }, data: { statut: "REJETEE", agentId: session.user.id, decisionLe: new Date(), motifRejet: motif } }),
    prisma.parcelle.update({ where: { id: demande.parcelleId }, data: { statut: "EN_VENTE" } }),
  ]);
  await notifier([demande.acheteurId, demande.parcelle.proprietaireId], `Demande d'achat rejetée pour ${demande.parcelleId} : ${motif}`, "/tableau-de-bord");
  await journaliser("demande_rejetee", { demandeId, parcelleId: demande.parcelleId, agentId: session.user.id, motif });
  revalidatePath(`/parcelles/${demande.parcelleId}`); revalidatePath("/tableau-de-bord/agent");
}
