import type { Metadata } from "next";
export const metadata: Metadata = { title: "Mentions légales" };
export default function PageMentions() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold text-encre">Mentions légales</h1>
      <p>FoncierSûr Bénin est un projet de démonstration technique. Aucune donnée, aucun document, aucune signature n&apos;a de valeur légale. Aucune parcelle réelle n&apos;est proposée.</p>
      <p>Cadre cité à titre pédagogique : Code Foncier et Domanial (loi n°2013-01 du 14 août 2013, modifiée par la loi n°2017-15 du 10 août 2017) ; ANDF, guichet unique de la réforme foncière. Seuls l&apos;ANDF, un notaire ou un géomètre agréé peuvent confirmer un droit.</p>
      <p>Les signatures Ed25519 prouvent l&apos;intégrité des données de cette démonstration, pas la propriété d&apos;un bien. Le paiement n&apos;est pas implémenté.</p>
    </div>
  );
}
