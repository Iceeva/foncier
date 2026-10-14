import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PatchCheckFill, ShieldExclamation } from "react-bootstrap-icons";
import { prisma } from "@/lib/prisma";
import { verifierSignature } from "@/lib/domain/signature";
import { TYPE_DOCUMENT_LABELS } from "@/lib/domain/refs";
import Facsimile from "@/components/document/facsimile";
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params; const d = await prisma.document.findUnique({ where: { id } });
  return { title: d ? `${TYPE_DOCUMENT_LABELS[d.type].label} ${d.numero}` : "Document introuvable" };
}
export default async function PageDocument({ params }: Props) {
  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id }, include: { parcelle: { include: { commune: true } }, titulaire: true } });
  if (!doc) notFound();
  const beneficiaire = doc.beneficiaireId ? await prisma.user.findUnique({ where: { id: doc.beneficiaireId } }) : null;
  const voisines = await prisma.parcelle.findMany({ where: { communeId: doc.parcelle.communeId, id: { not: doc.parcelleId } } });
  const proches = voisines.map((v) => ({ v, d: Math.hypot(v.lat - doc.parcelle.lat, v.lng - doc.parcelle.lng) })).sort((a, b) => a.d - b.d).slice(0, 4).map((x) => x.v);
  const cotes = ["Nord", "Sud", "Est", "Ouest"];
  const limites = cotes.map((cote, i) => `${cote} : ${proches[i] ? `parcelle ${proches[i].id}` : "voie publique / limite de lotissement"}`);
  const signatureValide = verifierSignature(doc.empreinteDonnees, doc.signature);
  return (
    <div>
      <p className="no-print"><Link href={`/parcelles/${doc.parcelleId}`} className="inline-flex items-center gap-1 text-sm text-vert hover:underline"><ArrowLeft aria-hidden /> Retour à la parcelle {doc.parcelleId}</Link></p>
      <div className="mt-4"><Facsimile doc={doc} parcelle={doc.parcelle} titulaire={doc.titulaire} beneficiaire={beneficiaire} limites={limites} /></div>
      <section className="no-print mx-auto mt-6 max-w-2xl rounded-lg border border-trait bg-carte p-4">
        <h2 className="text-lg font-bold text-encre">Vérifier la signature de ce document</h2>
        {signatureValide ? <p className="mt-2 flex items-center gap-2 font-bold text-vert-fonce"><PatchCheckFill aria-hidden /> Signature Ed25519 valide - document non altéré depuis sa signature par la plateforme.</p>
          : <p className="mt-2 flex items-center gap-2 font-bold text-rouge"><ShieldExclamation aria-hidden /> Signature invalide - ce document a peut-être été altéré.</p>}
        <dl className="mt-3 space-y-2 text-sm">
          <div><dt className="font-bold">Empreinte des données (SHA-256)</dt><dd className="break-all font-mono text-xs">{doc.empreinteDonnees}</dd></div>
          <div><dt className="font-bold">Signature (Ed25519, base64)</dt><dd className="break-all font-mono text-xs">{doc.signature}</dd></div>
          <div><dt className="font-bold">Clé de signature</dt><dd>{doc.signePar}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-texte-doux">Vous pouvez vérifier cette signature indépendamment sur <Link href="/verification-signature" className="text-vert underline">/verification-signature</Link>, avec la clé publique de la plateforme.</p>
      </section>
    </div>
  );
}
