import type { Metadata } from "next";
import { redirect } from "next/navigation";
export const metadata: Metadata = { title: "Vérifier une parcelle" };
export default async function PageVerifier({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const id = typeof sp.id === "string" ? sp.id.trim().toUpperCase() : "";
  if (id) redirect(`/parcelles/${id}`);
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-encre">Vérifier une parcelle</h1>
      <form method="get" className="mt-4 flex items-end gap-2">
        <label className="flex flex-1 flex-col gap-1 text-sm font-bold">Numéro de parcelle<input name="id" placeholder="Exemple : CAL-0001" className="rounded-md border-2 border-trait px-3 py-2 font-normal" /></label>
        <button className="rounded-md border-2 border-encre bg-jaune px-4 py-2 font-bold">Vérifier</button>
      </form>
    </div>
  );
}
