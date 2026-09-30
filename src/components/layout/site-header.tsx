import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { ROLE_LABELS, ROUTE_TABLEAU_DE_BORD } from "@/lib/domain/refs";
import ClocheNotifications from "./cloche-notifications";

const NAV_PUBLIQUE = [
  { href: "/parcelles", label: "Terrains" }, { href: "/carte", label: "Carte" },
  { href: "/verifier", label: "Vérifier" }, { href: "/verification-andf", label: "Vérif. ANDF" }, { href: "/aide", label: "Aide" },
];

export default async function SiteHeader() {
  const session = await auth();
  return (
    <header className="border-t-4 border-vert bg-carte">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <Link href="/" className="text-lg font-bold text-encre">
          Foncier<b className="text-vert">Sûr</b> <span className="font-normal text-texte-doux">Bénin</span>
        </Link>
        <nav aria-label="Navigation principale">
          <ul className="flex flex-wrap items-center gap-1">
            {NAV_PUBLIQUE.map((item) => (
              <li key={item.href}><Link href={item.href} className="rounded-md px-3 py-1.5 text-sm font-medium text-encre hover:bg-vert-clair">{item.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <ClocheNotifications />
              <Link href={ROUTE_TABLEAU_DE_BORD[session.user.role]} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-bold text-vert hover:bg-vert-clair">
                {(() => { const Icone = ROLE_LABELS[session.user.role].icone; return <Icone aria-hidden />; })()}
                Mon tableau de bord
              </Link>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                <button className="rounded-md border-2 border-encre px-3 py-1.5 text-sm font-bold text-encre hover:bg-vert-clair">Se déconnecter</button>
              </form>
            </>
          ) : (
            <Link href="/connexion" className="rounded-md border-2 border-encre bg-jaune px-4 py-1.5 text-sm font-bold text-encre hover:bg-jaune/80">Se connecter</Link>
          )}
        </div>
      </div>
    </header>
  );
}
