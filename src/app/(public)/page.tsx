import Link from "next/link";
export default function AccueilPublic() {
  return (
    <div>
      <section className="rounded-lg bg-vert px-8 py-12 text-white">
        <h1 className="max-w-2xl text-4xl font-bold">Vérifiez un terrain avant de l&apos;acheter.</h1>
        <p className="mt-4 max-w-xl text-lg text-vert-clair">
          FoncierSûr Bénin aide à visualiser, vérifier et sécuriser l&apos;information foncière - projet de démonstration technique, données fictives, sans valeur juridique.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/parcelles" className="rounded-md border-2 border-white bg-jaune px-5 py-2.5 font-bold text-encre">Rechercher un terrain</Link>
          <Link href="/verifier" className="rounded-md border-2 border-white px-5 py-2.5 font-bold text-white hover:bg-white/10">Vérifier un numéro</Link>
        </div>
      </section>
    </div>
  );
}
