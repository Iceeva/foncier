import { auth } from "@/lib/auth";
import { fcfa } from "@/lib/format";
import FormulaireGestion from "./formulaire-gestion";

export default async function WidgetGestionProprietaire({ parcelleId, proprietaireId, statut, prix }: { parcelleId: string; proprietaireId: string; statut: string; prix: number | null }) {
  const session = await auth();
  const estGestionnaire = session?.user && (session.user.id === proprietaireId || session.user.role === "ADMIN");
  if (!estGestionnaire) return null;

  return (
    <section className="mt-6 rounded-lg border border-trait bg-carte p-4">
      <h2 className="text-lg font-bold text-encre">Gérer mon terrain</h2>
      {statut === "LITIGE" ? (
        <FormulaireGestion parcelleId={parcelleId} mode="lever" />
      ) : statut === "EN_COURS" ? (
        <p className="mt-2 text-sm text-texte-doux">Une demande d&apos;achat est en cours d&apos;instruction : les actions de gestion sont temporairement indisponibles.</p>
      ) : (
        <>
          <FormulaireGestion parcelleId={parcelleId} mode={statut === "EN_VENTE" ? "modifier" : "vendre"} prixActuel={prix} />
          {statut === "EN_VENTE" && <FormulaireGestion parcelleId={parcelleId} mode="retirer" />}
          <FormulaireGestion parcelleId={parcelleId} mode="litige" />
        </>
      )}
      <p className="mt-2 text-xs text-texte-doux">Prix actuel : {fcfa(prix)}</p>
    </section>
  );
}
