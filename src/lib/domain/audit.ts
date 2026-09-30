// ============================================================================
// lib/domain/audit.ts — journal d'audit CHAÎNÉ et SIGNÉ.
// Chaque entrée contient l'empreinte SHA-256 de l'entrée précédente (comme
// une petite chaîne de blocs) ET une signature Ed25519 de la plateforme.
// Modifier une ligne passée invaliderait sa signature ET l'empreinte de
// toutes les entrées suivantes : double protection, l'une cryptographique
// (signature), l'autre structurelle (chaînage).
// ============================================================================
import { prisma } from "@/lib/prisma";
import { empreinte, signerEmpreinte, verifierSignature } from "./signature";

type Details = Record<string, unknown>;

function empreinteDe(e: { action: string; details: Details; precedent: string; quand: string }) {
  return empreinte(JSON.stringify({ action: e.action, details: e.details, precedent: e.precedent, quand: e.quand }));
}

export async function journaliser(action: string, details: Details) {
  const derniere = await prisma.auditLog.findFirst({ orderBy: { createdAt: "desc" } });
  const precedent = derniere?.empreinte ?? "0".repeat(64);
  const quand = new Date().toISOString();
  const empreinteEntree = empreinteDe({ action, details, precedent, quand });
  const { signature } = signerEmpreinte(empreinteEntree);
  return prisma.auditLog.create({ data: { action, details: details as never, precedent, empreinte: empreinteEntree, signature, createdAt: new Date(quand) } });
}

export type ResultatVerification = { intacte: boolean; premiereRuptureId?: string; motif?: string };

/** Recalcule toute la chaîne et vérifie empreintes + signatures. */
export async function verifierChaine(): Promise<ResultatVerification> {
  const entrees = await prisma.auditLog.findMany({ orderBy: { createdAt: "asc" } });
  let precedentAttendu = "0".repeat(64);
  for (const e of entrees) {
    const quand = e.createdAt.toISOString();
    const empreinteRecalculee = empreinteDe({ action: e.action, details: e.details as Details, precedent: e.precedent, quand });
    if (e.precedent !== precedentAttendu) return { intacte: false, premiereRuptureId: e.id, motif: "Chaînage rompu (l'empreinte précédente ne correspond pas)." };
    if (empreinteRecalculee !== e.empreinte) return { intacte: false, premiereRuptureId: e.id, motif: "Empreinte recalculée différente : les données ont été modifiées." };
    if (!verifierSignature(e.empreinte, e.signature)) return { intacte: false, premiereRuptureId: e.id, motif: "Signature Ed25519 invalide." };
    precedentAttendu = e.empreinte;
  }
  return { intacte: true };
}
