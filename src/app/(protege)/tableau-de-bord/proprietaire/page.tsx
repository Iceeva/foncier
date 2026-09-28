import { exigerRole } from "@/lib/session";
export default async function TableauDeBordProprietaire() {
  const session = await exigerRole("PROPRIETAIRE");
  return (
    <div>
      <h1 className="text-2xl font-bold text-encre">Bienvenue, {session.user.name}</h1>
      <p className="mt-1 text-texte-doux">Tableau de bord — proprietaire.</p>
      <p className="mt-6 text-sm text-texte-doux">Ce tableau de bord s&apos;enrichira au fil des prochains commits.</p>
    </div>
  );
}
