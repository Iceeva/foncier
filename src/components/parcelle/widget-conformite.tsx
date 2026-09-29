import { CheckCircleFill, ExclamationTriangleFill } from "react-bootstrap-icons";
import type { Anomalie } from "@/lib/domain/conformite";
const STYLE_GRAVITE: Record<Anomalie["gravite"], string> = {
  bloquant: "border-rouge bg-red-50 text-rouge", alerte: "border-jaune bg-jaune-clair text-encre", info: "border-vert bg-vert-clair text-vert-fonce",
};
export default function WidgetConformite({ anomalies, chevauche }: { anomalies: Anomalie[]; chevauche: { id: string }[] }) {
  const total = anomalies.length + (chevauche.length ? 1 : 0);
  return (
    <section className="mt-6 rounded-lg border border-trait bg-carte p-4" aria-labelledby="t-conformite">
      <h2 id="t-conformite" className="text-lg font-bold text-encre">Conformité des documents</h2>
      {total === 0 ? (
        <p className="mt-2 flex items-center gap-2 font-bold text-vert-fonce"><CheckCircleFill aria-hidden /> Aucune anomalie détectée sur les documents fournis.</p>
      ) : (
        <p className="mt-2 flex items-center gap-2 font-bold text-rouge"><ExclamationTriangleFill aria-hidden /> {total} point(s) à vérifier avant toute transaction.</p>
      )}
      {(anomalies.length > 0 || chevauche.length > 0) && (
        <ul className="mt-3 space-y-2">
          {anomalies.map((a) => <li key={a.code} className={`rounded-md border-l-4 px-3 py-2 text-sm ${STYLE_GRAVITE[a.gravite]}`}>{a.message}</li>)}
          {chevauche.length > 0 && <li className={`rounded-md border-l-4 px-3 py-2 text-sm ${STYLE_GRAVITE.bloquant}`}>Chevauchement géographique détecté avec {chevauche.map((c) => c.id).join(", ")} — deux parcelles occupent apparemment le même terrain.</li>}
        </ul>
      )}
      <p className="mt-3 text-xs text-texte-doux">Cette analyse porte uniquement sur les documents enregistrés dans la plateforme ; elle ne remplace pas une vérification par un notaire ou l&apos;ANDF.</p>
    </section>
  );
}
