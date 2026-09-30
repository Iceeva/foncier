"use server";
// Actions serveur — gestion réelle d'un terrain par son propriétaire :
// mise en vente, prix, signalement de litige. Chaque action revérifie
// que l'utilisateur connecté EST le propriétaire enregistré de la parcelle.
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { exigerSession } from "@/lib/session";
import { journaliser } from "@/lib/domain/audit";

async function exigerProprietaire(parcelleId: string) {
  const session = await exigerSession();
  const parcelle = await prisma.parcelle.findUnique({ where: { id: parcelleId } });
  if (!parcelle) throw new Error("Parcelle introuvable.");
  if (parcelle.proprietaireId !== session.user.id && session.user.role !== "ADMIN") throw new Error("Vous n'êtes pas le propriétaire enregistré de ce terrain.");
  return { session, parcelle };
}

export async function mettreEnVenteAction(formData: FormData): Promise<{ erreur?: string }> {
  const parcelleId = String(formData.get("parcelleId") ?? "");
  const prix = Number(formData.get("prix"));
  try {
    const { session, parcelle } = await exigerProprietaire(parcelleId);
    if (parcelle.statut === "EN_COURS") return { erreur: "Une demande d'achat est en cours sur ce terrain." };
    if (!(prix > 0)) return { erreur: "Indiquez un prix valide." };
    await prisma.parcelle.update({ where: { id: parcelleId }, data: { statut: "EN_VENTE", prix } });
    await journaliser("parcelle_mise_en_vente", { parcelleId, prix, par: session.user.id });
    revalidatePath(`/parcelles/${parcelleId}`);
    return {};
  } catch (e) { return { erreur: (e as Error).message }; }
}

export async function retirerDeVenteAction(parcelleId: string) {
  const { session, parcelle } = await exigerProprietaire(parcelleId);
  if (parcelle.statut === "EN_COURS") throw new Error("Une demande d'achat est en cours sur ce terrain.");
  await prisma.parcelle.update({ where: { id: parcelleId }, data: { statut: "HORS_VENTE" } });
  await journaliser("parcelle_retiree_vente", { parcelleId, par: session.user.id });
  revalidatePath(`/parcelles/${parcelleId}`);
}

export async function signalerLitigeAction(parcelleId: string, motif: string) {
  const { session } = await exigerProprietaire(parcelleId);
  await prisma.parcelle.update({ where: { id: parcelleId }, data: { statut: "LITIGE" } });
  await journaliser("litige_signale", { parcelleId, par: session.user.id, motif });
  revalidatePath(`/parcelles/${parcelleId}`);
}

export async function leverLitigeAction(parcelleId: string) {
  const { session } = await exigerProprietaire(parcelleId);
  await prisma.parcelle.update({ where: { id: parcelleId }, data: { statut: "HORS_VENTE" } });
  await journaliser("litige_leve", { parcelleId, par: session.user.id });
  revalidatePath(`/parcelles/${parcelleId}`);
}
