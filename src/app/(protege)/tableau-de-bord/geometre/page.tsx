import { exigerRole } from "@/lib/session";
import EspaceProfessionnel from "@/components/pro/espace-professionnel";
export default async function TableauDeBordGeometre() {
  const session = await exigerRole("GEOMETRE");
  return (
    <div>
      <h1 className="text-2xl font-bold text-encre">Bienvenue, {session.user.name}</h1>
      <p className="mt-1 text-texte-doux">Espace géomètre.</p>
      <EspaceProfessionnel userId={session.user.id} role="GEOMETRE" />
    </div>
  );
}
