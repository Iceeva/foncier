"use server";
// Actions serveur - dépôt d'une pièce par un professionnel (notaire ou
// géomètre) : PV de bornage ou acte de vente notarié, signés par la
// plateforme au moment du dépôt, exactement comme les documents du seed.
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { exigerRole } from "@/lib/session";
import { empreinte, signerEmpreinte } from "@/lib/domain/signature";
import { journaliser } from "@/lib/domain/audit";

const TYPE_PAR_ROLE = { GEOMETRE: "BORNAGE", NOTAIRE: "ACTE_NOTARIE" } as const;
const schema = z.object({ parcelleId: z.string().min(1), numero: z.string().min(3), date: z.string().min(1) });

export async function deposerPieceAction(formData: FormData): Promise<{ erreur?: string }> {
  const session = await exigerRole("NOTAIRE", "GEOMETRE");
  const champs = schema.safeParse(Object.fromEntries(formData));
  if (!champs.success) return { erreur: "Formulaire invalide." };
  const { parcelleId, numero, date } = champs.data;

  const parcelle = await prisma.parcelle.findUnique({ where: { id: parcelleId } });
  if (!parcelle) return { erreur: "Parcelle introuvable." };

  const type = TYPE_PAR_ROLE[session.user.role as keyof typeof TYPE_PAR_ROLE];
  const numeroFinal = numero.trim().toUpperCase();
  const existe = await prisma.document.findUnique({ where: { numero: numeroFinal } });
  if (existe) return { erreur: "Ce numéro de document existe déjà." };

  const donnees = `${numeroFinal}|${type}|${parcelleId}|${parcelle.proprietaireId}|${date}`;
  const empreinteDonnees = empreinte(donnees);
  const { signature, signePar } = signerEmpreinte(empreinteDonnees);

  const doc = await prisma.document.create({
    data: { parcelleId, type, numero: numeroFinal, date: new Date(date), titulaireId: parcelle.proprietaireId, deposeParId: session.user.id, empreinteDonnees, signature, signePar },
  });
  await journaliser("document_depose", { documentId: doc.id, parcelleId, type, deposePar: session.user.id });
  revalidatePath(`/parcelles/${parcelleId}`);
  return {};
}

export async function terminerRdvAction(rdvId: string) {
  const session = await exigerRole("NOTAIRE", "GEOMETRE");
  const rdv = await prisma.rdv.findUnique({ where: { id: rdvId }, include: { participants: true } });
  if (!rdv || !rdv.participants.some((p) => p.userId === session.user.id)) throw new Error("Rendez-vous introuvable.");
  await prisma.rdv.update({ where: { id: rdvId }, data: { statut: "TERMINE" } });
  revalidatePath("/tableau-de-bord/notaire"); revalidatePath("/tableau-de-bord/geometre");
}
