import type { Metadata } from "next";
import { clePubliquePem } from "@/lib/domain/signature";
import FormulaireVerification from "./formulaire";
export const metadata: Metadata = { title: "Vérifier la signature de la plateforme" };
export default function PageVerificationSignature() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-encre">Vérifier la signature de la plateforme</h1>
      <p className="mt-2 text-texte-doux">Chaque document et chaque entrée du journal d&apos;audit sont signés avec la clé privée Ed25519 de FoncierSûr Bénin. N&apos;importe qui peut vérifier une signature avec la clé publique ci-dessous.</p>
      <h2 className="mt-6 text-lg font-bold text-encre">Clé publique de la plateforme</h2>
      <pre className="mt-2 overflow-x-auto rounded-lg border border-trait bg-carte p-4 text-xs">{clePubliquePem()}</pre>
      <h2 className="mt-6 text-lg font-bold text-encre">Vérifier une empreinte et une signature</h2>
      <FormulaireVerification />
    </div>
  );
}
