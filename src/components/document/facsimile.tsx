import type { Document, Parcelle, User } from "@/generated/prisma/client";
import { TYPE_DOCUMENT_LABELS, USAGE_LABELS } from "@/lib/domain/refs";
import { fcfa, m2, dateFr } from "@/lib/format";
type Props = { doc: Document; parcelle: Parcelle & { commune: { nom: string; code: string } }; titulaire: Pick<User, "nom" | "telephone">; beneficiaire?: Pick<User, "nom"> | null; limites: string[] };
const BASE_LEGALE = "Code Foncier et Domanial - loi n°2013-01 du 14 août 2013, modifiée et complétée par la loi n°2017-15 du 10 août 2017.";
function Table({ rows }: { rows: [string, string][] }) {
  return <table className="my-3 w-full border-collapse"><tbody>{rows.map(([k, v]) => <tr key={k} className="border-b border-[#e8ddc2]"><th className="w-2/5 px-1 py-2 text-left font-bold">{k}</th><td className="px-1 py-2">{v}</td></tr>)}</tbody></table>;
}
function Corps({ doc, parcelle, titulaire, beneficiaire, limites }: Props) {
  switch (doc.type) {
    case "TF": return (<><p>Le présent titre confère à son titulaire le droit de propriété sur l&apos;immeuble ci-après désigné, conformément au {BASE_LEGALE}</p>
      <Table rows={[["Numéro du titre", doc.numero], ["Commune / Quartier", `${parcelle.commune.nom}, ${parcelle.quartier}`], ["Superficie", m2(parcelle.superficie)], ["Coordonnées (centre)", `${parcelle.lat.toFixed(5)}° N, ${parcelle.lng.toFixed(5)}° E`], ["Usage déclaré", USAGE_LABELS[parcelle.usage]], ["Titulaire du droit", `${titulaire.nom} (${titulaire.telephone ?? "-"})`]]} /></>);
    case "PLAN": return (<><p>Extrait du plan cadastral établi à partir de la levée topographique de la parcelle.</p><Table rows={[["Superficie mesurée", m2(parcelle.superficie)], ["Système de référence", "WGS 84 (coordonnées géographiques)"]]} /></>);
    case "BORNAGE": return (<><p>Procès-verbal de bornage contradictoire, dressé en présence des propriétaires riverains et clôturant la délimitation matérielle de la parcelle.</p><ul className="columns-2 list-inside list-disc">{limites.map((l) => <li key={l}>{l}</li>)}</ul></>);
    case "CERT_APPARTENANCE": return (<><p>Il est certifié que la parcelle ci-dessus désignée appartient, au jour de la délivrance du présent certificat, à :</p><p className="my-3 text-center text-xl font-bold">{titulaire.nom}</p><p>Validité : {doc.expire ? `jusqu'au ${dateFr(doc.expire)}` : "durée non limitée, sous réserve de mutation"}.</p></>);
    case "QUITUS": return (<><p>Il est attesté que les impôts fonciers relatifs à la parcelle ci-dessus désignée sont acquittés à la date de délivrance du présent quitus.</p><Table rows={[["Redevable", titulaire.nom], ["Validité", doc.expire ? dateFr(doc.expire) : "Non limitée"]]} /></>);
    case "CONVENTION": return (<><p>Convention par laquelle <strong>{titulaire.nom}</strong> (vendeur) s&apos;engage à céder la parcelle ci-dessus désignée à <strong>{beneficiaire?.nom ?? "un acquéreur non identifié"}</strong> (acquéreur), moyennant le prix indiqué ci-dessous.</p><Table rows={[["Prix convenu", fcfa(doc.montant ?? parcelle.prix)]]} /></>);
    case "ACTE_NOTARIE": return <p>Acte authentique de vente, établi et reçu par un notaire, constatant le transfert de propriété de la parcelle ci-dessus désignée.</p>;
    case "HYPOTHEQUE": return (<><p>Inscription d&apos;hypothèque grevant la parcelle ci-dessus désignée, en garantie d&apos;un engagement souscrit par le titulaire.</p><Table rows={[["Montant garanti", fcfa(doc.montant)], ["Établissement bénéficiaire", doc.banque ?? "-"], ["Statut", doc.statut === "radie" ? "Radiée" : "Non radiée - inscription en cours"]]} /></>);
    default: return null;
  }
}
export default function Facsimile(props: Props) {
  const { doc, parcelle } = props;
  return (
    <article className="mx-auto max-w-2xl border border-[#cbb98a] bg-[#fffef8] p-8 shadow-[0_0_0_6px_#fffef8,0_0_0_7px_#cbb98a]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <header className="border-b-[3px] border-double border-encre pb-4 text-center">
        <p className="m-0 font-bold tracking-widest">RÉPUBLIQUE DU BÉNIN</p>
        <p className="mb-3 mt-1 text-sm text-texte-doux">Agence Nationale du Domaine et du Foncier - Base numérique du cadastre (e-Foncier Bénin)</p>
        <h1 className="my-1 text-2xl font-bold">{TYPE_DOCUMENT_LABELS[doc.type].label}</h1>
        <p className="font-bold tracking-wide">N° {doc.numero}</p>
      </header>
      <div className="mt-4"><Corps {...props} /></div>
      <Table rows={[["Parcelle concernée", `${parcelle.id} - ${parcelle.quartier}, ${parcelle.commune.nom} (${parcelle.commune.code})`], ["Date de délivrance", dateFr(doc.date)]]} />
      <p className="mt-6 border-t border-[#e8ddc2] pt-3 text-sm text-texte-doux">Document établi conformément au {BASE_LEGALE} L&apos;ANDF est l&apos;autorité compétente pour la confirmation officielle de ce document.</p>
      <div className="mt-4 flex items-center gap-4">
        <div aria-hidden className="grid h-24 w-24 shrink-0 -rotate-6 place-items-center rounded-full border-[3px] border-double border-vert text-center text-[11px] font-bold text-vert">ANDF<br />e-Foncier</div>
        <p className="text-sm text-texte-doux">Signature numérique de la plateforme : voir ci-dessous (Ed25519, vérifiable publiquement sur <a href="/verification-signature" className="text-vert underline">/verification-signature</a>).</p>
      </div>
    </article>
  );
}
