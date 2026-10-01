import Link from "next/link";
export default function NotFound() {
  return <main id="contenu" className="mx-auto max-w-xl px-6 py-24 text-center"><h1 className="text-3xl font-bold">Page introuvable</h1><p className="mt-2 text-texte-doux">Cette page n&apos;existe pas ou plus.</p><Link href="/" className="mt-4 inline-block rounded-md border-2 border-encre bg-jaune px-4 py-2 font-bold">Retour à l&apos;accueil</Link></main>;
}
