import type { ComponentType } from "react";
import type { IconProps } from "react-bootstrap-icons";
import { Cart, HouseDoor, ShieldCheck, Bank, Triangle, Gear, CircleFill, Circle, HourglassSplit, ExclamationTriangleFill } from "react-bootstrap-icons";
import type { MotifRdv, Role, StatutDemande, StatutParcelle, StatutRdv, TypeDocument, UsageParcelle } from "@/generated/prisma/enums";

type Icone = ComponentType<IconProps>;

export const COMMUNES: Record<string, { code: string; centreLat: number; centreLng: number }> = {
  "Abomey-Calavi": { code: "CAL", centreLat: 6.4485, centreLng: 2.3557 },
  Cotonou: { code: "COT", centreLat: 6.3703, centreLng: 2.3912 },
  "Porto-Novo": { code: "PNO", centreLat: 6.4969, centreLng: 2.6289 },
  Parakou: { code: "PAR", centreLat: 9.337, centreLng: 2.6303 },
  Ouidah: { code: "OUI", centreLat: 6.363, centreLng: 2.085 },
  "Sèmè-Podji": { code: "SEM", centreLat: 6.3833, centreLng: 2.6167 },
  Bohicon: { code: "BOH", centreLat: 7.1783, centreLng: 2.0667 },
};

export const USAGE_LABELS: Record<UsageParcelle, string> = {
  RESIDENTIEL: "Résidentiel", COMMERCIAL: "Commercial", AGRICOLE: "Agricole", TOURISTIQUE: "Touristique", INDUSTRIEL: "Industriel",
};

export const STATUT_PARCELLE_LABELS: Record<StatutParcelle, { label: string; icone: Icone; couleur: string }> = {
  EN_VENTE: { label: "En vente", icone: CircleFill, couleur: "#0f6b4f" },
  HORS_VENTE: { label: "Hors vente", icone: Circle, couleur: "#57606a" },
  EN_COURS: { label: "Demande en cours", icone: HourglassSplit, couleur: "#8a5a00" },
  LITIGE: { label: "Litige", icone: ExclamationTriangleFill, couleur: "#b42318" },
};

export const TYPE_DOCUMENT_LABELS: Record<TypeDocument, { label: string; prefixe: string }> = {
  TF: { label: "Titre foncier", prefixe: "TF" },
  PLAN: { label: "Plan cadastral", prefixe: "PL" },
  BORNAGE: { label: "PV de bornage", prefixe: "BN" },
  CERT_APPARTENANCE: { label: "Certificat d'appartenance", prefixe: "CA" },
  QUITUS: { label: "Quitus fiscal", prefixe: "QF" },
  CONVENTION: { label: "Convention de vente", prefixe: "CV" },
  ACTE_NOTARIE: { label: "Acte de vente notarié", prefixe: "AN" },
  HYPOTHEQUE: { label: "Inscription d'hypothèque", prefixe: "HY" },
};

export const ROLE_LABELS: Record<Role, { label: string; icone: Icone }> = {
  ACHETEUR: { label: "Acheteur", icone: Cart },
  PROPRIETAIRE: { label: "Propriétaire", icone: HouseDoor },
  AGENT: { label: "Agent foncier", icone: ShieldCheck },
  NOTAIRE: { label: "Notaire", icone: Bank },
  GEOMETRE: { label: "Géomètre", icone: Triangle },
  ADMIN: { label: "Administrateur", icone: Gear },
};

export const STATUT_DEMANDE_LABELS: Record<StatutDemande, string> = {
  EN_ATTENTE: "En attente d'instruction", VALIDEE: "Validée — propriété transférée", REJETEE: "Rejetée", ANNULEE: "Annulée par l'acheteur",
};

export const MOTIF_RDV_LABELS: Record<MotifRdv, string> = {
  VISITE: "Visite du terrain", VERIFICATION_GEOMETRE: "Vérification géomètre (bornage)",
  SIGNATURE_NOTAIRE: "Signature chez le notaire", REMISE_DOCUMENTS: "Remise de documents",
};

export const STATUT_RDV_LABELS: Record<StatutRdv, string> = {
  PROPOSE: "Proposé", CONFIRME: "Confirmé", REFUSE: "Refusé", ANNULE: "Annulé", TERMINE: "Terminé",
};

export const ROUTE_TABLEAU_DE_BORD: Record<Role, string> = {
  ACHETEUR: "/tableau-de-bord/acheteur", PROPRIETAIRE: "/tableau-de-bord/proprietaire", AGENT: "/tableau-de-bord/agent",
  NOTAIRE: "/tableau-de-bord/notaire", GEOMETRE: "/tableau-de-bord/geometre", ADMIN: "/tableau-de-bord/admin",
};
