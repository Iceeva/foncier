// lib/domain/controle.ts - checklist de contrôle approfondi que l'agent
// foncier doit parcourir avant de statuer sur une demande d'achat.
export const POINTS_CONTROLE = [
  { id: "identite", label: "Identité de l'acheteur et du vendeur vérifiée" },
  { id: "origine", label: "Origine de propriété cohérente (chaîne des titulaires sans rupture suspecte)" },
  { id: "cadastre", label: "Situation cadastrale contrôlée (pas de chevauchement avec une autre parcelle)" },
  { id: "charges", label: "Absence de charge bloquante (hypothèque non levée, litige en cours)" },
  { id: "fiscal", label: "Impôts fonciers à jour (quitus fiscal valide)" },
  { id: "unicite", label: "Absence de vente concurrente (pas d'autre demande active sur cette même parcelle)" },
] as const;
export type PointControle = (typeof POINTS_CONTROLE)[number]["id"];
export type Controle = Partial<Record<PointControle, boolean>>;
export const controleComplet = (c: Controle): boolean => POINTS_CONTROLE.every((p) => c[p.id] === true);
