import Link from "next/link";
export default function SiteFooter() {
  return (
    <footer className="border-t border-trait px-6 py-6 text-center text-sm text-texte-doux">
      <p>Projet de démonstration réalisé pour la <em>sécurisation du foncier</em>. Toutes les données sont fictives et n&apos;ont aucune valeur juridique. Le paiement n&apos;est pas implémenté.</p>
      <p className="mt-1">
        <Link href="/aide" className="underline">Aide</Link> · <Link href="/mentions-legales" className="underline">Mentions légales</Link> · <Link href="/verification-signature" className="underline">Vérifier la signature de la plateforme</Link>
      </p>
    </footer>
  );
}
