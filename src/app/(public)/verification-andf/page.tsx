import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircleFill, XCircleFill, Bank } from "react-bootstrap-icons";
import { prisma } from "@/lib/prisma";
import { TYPE_DOCUMENT_LABELS } from "@/lib/domain/refs";
import { dateFr } from "@/lib/format";
export const metadata: Metadata = { title: "Vérification ANDF (simulation)" };
async function rechercher(numero: string) {
  const n = numero.trim().toUpperCase(); if (!n) return null;
  const doc = await prisma.document.findUnique({ where: { numero: n }, include: { parcelle: { include: { commune: true } }, titulaire: true } });
  return { numero: n, doc };
}
export default async function PageVerificationAndf({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const numero = typeof sp.numero === "string" ? sp.numero : "";
  const resultat = numero ? await rechercher(numero) : null;
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-encre"><Bank aria-hidden /> Vérification d&apos;un document (simulation ANDF)</h1>
      <p className="mt-2 text-texte-doux">Cet outil simule une consultation de la base numérique du cadastre (e-Foncier Bénin). Il compare le numéro saisi aux documents connus de cette plateforme de démonstration.</p>
      <form method="get" className="mt-4 flex flex-wrap items-end gap-2">
        <label className="flex flex-1 flex-col gap-1 text-sm font-bold">Numéro de document<input name="numero" defaultValue={numero} placeholder="Exemple : TF-00001-CAL" className="rounded-md border-2 border-trait px-3 py-2 font-normal" /></label>
        <button type="submit" className="rounded-md border-2 border-encre bg-jaune px-4 py-2 font-bold text-encre">Vérifier</button>
      </form>
      {resultat?.doc && (
        <div className="mt-4 rounded-lg border-2 border-vert bg-carte p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-vert-fonce"><CheckCircleFill aria-hidden /> Document reconnu dans la base numérique du cadastre (simulation)</h2>
          <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div><dt className="text-texte-doux">Type</dt><dd className="font-bold">{TYPE_DOCUMENT_LABELS[resultat.doc.type].label}</dd></div>
            <div><dt className="text-texte-doux">Numéro</dt><dd className="font-bold">{resultat.doc.numero}</dd></div>
            <div><dt className="text-texte-doux">Parcelle rattachée</dt><dd><Link href={`/parcelles/${resultat.doc.parcelleId}`} className="font-bold text-vert underline">{resultat.doc.parcelle.id} — {resultat.doc.parcelle.quartier}, {resultat.doc.parcelle.commune.nom}</Link></dd></div>
            <div><dt className="text-texte-doux">Titulaire déclaré</dt><dd className="font-bold">{resultat.doc.titulaire.nom}</dd></div>
            <div><dt className="text-texte-doux">Date de délivrance</dt><dd className="font-bold">{dateFr(resultat.doc.date)}</dd></div>
          </dl>
          <p className="mt-3"><Link href={`/documents/${resultat.doc.id}`} className="text-vert underline">Consulter le fac-similé complet</Link></p>
        </div>
      )}
      {resultat && !resultat.doc && (
        <div className="mt-4 rounded-lg border-2 border-rouge bg-red-50 p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-rouge"><XCircleFill aria-hidden /> Numéro non reconnu</h2>
          <p className="mt-2 text-sm">Le numéro <strong>{resultat.numero}</strong> ne correspond à aucun document de cette base de démonstration.</p>
        </div>
      )}
      <p className="mt-6 text-sm text-texte-doux">Pour une vérification officielle, contactez l&apos;ANDF ou un notaire.</p>
    </div>
  );
}
