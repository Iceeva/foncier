import { CartCheck } from "react-bootstrap-icons";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STATUT_DEMANDE_LABELS } from "@/lib/domain/refs";
import { fcfa } from "@/lib/format";
import FormulaireDemande from "./formulaire-demande";

export default async function WidgetDemande({ parcelleId, statut, prix }: { parcelleId: string; statut: string; prix: number | null }) {
  const session = await auth();
  if (statut !== "EN_VENTE" && statut !== "EN_COURS") return null;

  const demandeEnCours = await prisma.demandeAchat.findFirst({ where: { parcelleId, statut: "EN_ATTENTE" }, include: { acheteur: { select: { nom: true } } } });

  return (
    <section className="mt-6 rounded-lg border border-trait bg-carte p-4" aria-labelledby="t-demande">
      <h2 id="t-demande" className="flex items-center gap-2 text-lg font-bold text-encre"><CartCheck aria-hidden /> Demande d&apos;achat</h2>
      <p className="mt-1 text-xl font-bold text-vert-fonce">{fcfa(prix)}</p>
      {demandeEnCours ? (
        <p className="mt-2 text-sm text-texte-doux">
          Une demande est en cours d&apos;instruction ({STATUT_DEMANDE_LABELS[demandeEnCours.statut]}
          {session?.user?.role === "AGENT" || session?.user?.role === "ADMIN" ? ` — par ${demandeEnCours.acheteur.nom}` : ""}).
        </p>
      ) : !session?.user ? (
        <p className="mt-2 text-sm text-texte-doux"><a href="/connexion" className="text-vert underline">Connectez-vous</a> en tant qu&apos;acheteur pour déposer une demande d&apos;achat.</p>
      ) : session.user.role !== "ACHETEUR" ? (
        <p className="mt-2 text-sm text-texte-doux">Seul un profil « Acheteur » peut déposer une demande d&apos;achat.</p>
      ) : (
        <FormulaireDemande parcelleId={parcelleId} />
      )}
      <p className="mt-3 text-xs text-texte-doux">
        Aucun paiement n&apos;est traité par la plateforme. La demande est instruite par un agent foncier
        (vérification en 6 points) avant tout transfert de propriété.
      </p>
    </section>
  );
}
