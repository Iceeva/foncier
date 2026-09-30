import { exigerRole } from "@/lib/session";
import EspaceProfessionnel from "@/components/pro/espace-professionnel";
export default async function TableauDeBordNotaire() {
  const session = await exigerRole("NOTAIRE");
  return (
    <div>
      <h1 className="text-2xl font-bold text-encre">Bienvenue, {session.user.name}</h1>
      <p className="mt-1 text-texte-doux">Espace notaire.</p>
      <EspaceProfessionnel userId={session.user.id} role="NOTAIRE" />
    </div>
  );
}
