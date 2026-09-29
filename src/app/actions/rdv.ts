"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { exigerSession } from "@/lib/session";
import { MOTIF_RDV_LABELS, STATUT_RDV_LABELS } from "@/lib/domain/refs";
import { notifier } from "@/lib/domain/notifications";
const schemaProposition = z.object({ parcelleId: z.string().min(1), motif: z.enum(["VISITE", "VERIFICATION_GEOMETRE", "SIGNATURE_NOTAIRE", "REMISE_DOCUMENTS"]), avecUserId: z.string().min(1), date: z.string().min(1), lieu: z.string().min(1) });
export async function proposerRdvAction(formData: FormData): Promise<{ erreur?: string }> {
  const session = await exigerSession();
  const champs = schemaProposition.safeParse(Object.fromEntries(formData));
  if (!champs.success) return { erreur: "Formulaire invalide." };
  const { parcelleId, motif, avecUserId, date, lieu } = champs.data;
  const dateRdv = new Date(date);
  if (Number.isNaN(dateRdv.getTime()) || dateRdv < new Date()) return { erreur: "La date doit être valide et dans le futur." };
  if (avecUserId === session.user.id) return { erreur: "Choisissez une autre personne que vous-même." };
  await prisma.rdv.create({ data: { parcelleId, motif, date: dateRdv, lieu, demandeurId: session.user.id, participants: { create: [{ userId: session.user.id }, { userId: avecUserId }] } } });
  await notifier([avecUserId], `Nouveau rendez-vous proposé (${MOTIF_RDV_LABELS[motif]}) pour la parcelle ${parcelleId}.`, "/tableau-de-bord/rendez-vous");
  revalidatePath(`/parcelles/${parcelleId}`); revalidatePath("/tableau-de-bord/rendez-vous");
  return {};
}
const STATUTS_AUTORISES = ["CONFIRME", "REFUSE", "ANNULE", "TERMINE"] as const;
export async function changerStatutRdvAction(rdvId: string, statut: (typeof STATUTS_AUTORISES)[number]) {
  const session = await exigerSession();
  const rdv = await prisma.rdv.findUnique({ where: { id: rdvId }, include: { participants: true } });
  if (!rdv) throw new Error("Rendez-vous introuvable.");
  const estParticipant = rdv.participants.some((p) => p.userId === session.user.id);
  if (!estParticipant) throw new Error("Vous ne participez pas à ce rendez-vous.");
  if (statut === "ANNULE" && rdv.demandeurId !== session.user.id) throw new Error("Seul l'auteur de la proposition peut l'annuler.");
  await prisma.rdv.update({ where: { id: rdvId }, data: { statut } });
  await notifier(rdv.participants.map((p) => p.userId), `Rendez-vous ${STATUT_RDV_LABELS[statut].toLowerCase()} pour la parcelle ${rdv.parcelleId}.`, "/tableau-de-bord/rendez-vous");
  revalidatePath(`/parcelles/${rdv.parcelleId}`); revalidatePath("/tableau-de-bord/rendez-vous");
}
