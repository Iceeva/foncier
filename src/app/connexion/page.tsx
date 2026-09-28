import type { Metadata } from "next";
import FormulaireConnexion from "./formulaire";
export const metadata: Metadata = { title: "Connexion" };
export default function PageConnexion() {
  return (
    <main id="contenu" className="flex min-h-screen items-center justify-center bg-fond px-4">
      <div className="w-full max-w-sm rounded-lg border border-trait bg-carte p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-encre">Connexion</h1>
        <p className="mt-1 text-sm text-texte-doux">FoncierSûr Bénin</p>
        <div className="mt-6"><FormulaireConnexion /></div>
        <p className="mt-6 text-xs text-texte-doux">Comptes de démonstration : voir le README (mot de passe commun « Demo1234! »).</p>
      </div>
    </main>
  );
}
