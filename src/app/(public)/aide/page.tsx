import type { Metadata } from "next";
import { ROLE_LABELS } from "@/lib/domain/refs";
export const metadata: Metadata = { title: "Aide" };
const ACTIONS: Record<string, string> = {
  ACHETEUR: "Recherche, vérifie et dépose une demande d'achat.", PROPRIETAIRE: "Met ses terrains en vente, fixe le prix, signale un litige.",
  AGENT: "Instruit les demandes : checklist en 6 points, validation ou rejet.", NOTAIRE: "Confirme les signatures, dépose l'acte de vente notarié.",
  GEOMETRE: "Confirme les bornages, dépose le procès-verbal.", ADMIN: "Supervise : statistiques, exports CSV, journal d'audit.",
};
export default function PageAide() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-encre">Comment utiliser FoncierSûr Bénin</h1>
      <ol className="mt-4 list-decimal space-y-1 pl-6"><li><strong>Chercher</strong> un terrain par numéro, filtres ou carte.</li><li><strong>Vérifier</strong> ses documents et ses anomalies éventuelles.</li><li><strong>Déposer une demande d&apos;achat</strong> : un agent foncier contrôle le dossier avant tout transfert (aucun paiement n&apos;est traité).</li></ol>
      <h2 className="mt-6 text-lg font-bold">Que fait chaque profil ?</h2>
      <dl className="mt-2 space-y-2">{Object.entries(ROLE_LABELS).map(([k, r]) => <div key={k} className="rounded-lg border border-trait bg-carte p-3"><dt className="font-bold">{r.label}</dt><dd className="text-sm text-texte-doux">{ACTIONS[k]}</dd></div>)}</dl>
      <p className="mt-6 text-sm text-texte-doux">Utilisez l&apos;icône d&apos;accessibilité en haut à droite pour agrandir le texte, activer le contraste élevé ou faire lire la page.</p>
    </div>
  );
}
