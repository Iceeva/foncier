import type { Document, Parcelle } from "@/generated/prisma/client";
import { TYPE_DOCUMENT_LABELS } from "./refs";
import { chevauchements, type Point } from "./geo";

export type Gravite = "bloquant" | "alerte" | "info";
export const POIDS_GRAVITE: Record<Gravite, number> = { bloquant: 3, alerte: 2, info: 1 };
export type Anomalie = { code: string; gravite: Gravite; message: string };
const OBLIGATOIRES = ["TF", "PLAN", "BORNAGE", "CERT_APPARTENANCE", "QUITUS"] as const;
type DocumentPourControle = Pick<Document, "type" | "numero" | "titulaireId" | "expire" | "statut" | "beneficiaireId">;
type ParcellePourChevauchement = Pick<Parcelle, "id"> & { polygone: Point[] };

export function analyserConformite(parcelle: Pick<Parcelle, "statut" | "proprietaireId">, documents: DocumentPourControle[], maintenant: Date = new Date()): Anomalie[] {
  const anomalies: Anomalie[] = [];
  const ajoute = (code: string, gravite: Gravite, message: string) => anomalies.push({ code, gravite, message });
  for (const type of OBLIGATOIRES) {
    if (!documents.some((d) => d.type === type)) ajoute("piece_manquante", "bloquant", `Pièce manquante : ${TYPE_DOCUMENT_LABELS[type].label}.`);
  }
  for (const d of documents) {
    if (d.expire && d.expire < maintenant) ajoute("document_expire", "bloquant", `${TYPE_DOCUMENT_LABELS[d.type].label} (${d.numero}) expiré depuis le ${d.expire.toLocaleDateString("fr-FR")}.`);
  }
  const structurants = documents.filter((d) => (["TF", "PLAN", "BORNAGE", "CERT_APPARTENANCE"] as const).includes(d.type as never));
  const titulaires = [...new Set(structurants.map((d) => d.titulaireId))];
  if (titulaires.length > 1) ajoute("titulaires_multiples", "bloquant", `Les documents fonciers ne désignent pas le même titulaire (${titulaires.length} personnes différentes trouvées). Vérification manuelle obligatoire.`);
  if (titulaires.length === 1 && titulaires[0] !== parcelle.proprietaireId) ajoute("proprietaire_incoherent", "bloquant", "Le propriétaire enregistré sur la fiche ne correspond pas au titulaire des documents fonciers.");
  const conventions = documents.filter((d) => d.type === "CONVENTION" && d.statut !== "annule");
  const beneficiaires = [...new Set(conventions.map((d) => d.beneficiaireId).filter((x): x is string => Boolean(x)))];
  if (beneficiaires.length > 1) ajoute("double_vente", "bloquant", `${beneficiaires.length} conventions de vente actives pour des acquéreurs différents : risque de double vente.`);
  if (documents.some((d) => d.type === "HYPOTHEQUE" && d.statut !== "radie")) ajoute("hypotheque", "alerte", "Une hypothèque est inscrite sur cette parcelle et n'a pas été radiée.");
  if (parcelle.statut === "LITIGE") ajoute("statut_litige", "bloquant", "Cette parcelle est signalée en litige.");
  return anomalies.sort((a, b) => POIDS_GRAVITE[b.gravite] - POIDS_GRAVITE[a.gravite]);
}
export const estAchetable = (anomalies: Anomalie[]) => !anomalies.some((a) => a.gravite === "bloquant");
export function parcellesChevauchantes<T extends ParcellePourChevauchement>(parcelle: T, autres: T[]): T[] { return chevauchements(parcelle, autres); }
