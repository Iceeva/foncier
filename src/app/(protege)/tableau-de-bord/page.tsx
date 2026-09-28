import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ROUTE_TABLEAU_DE_BORD } from "@/lib/domain/refs";
export default async function TableauDeBordRacine() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  redirect(ROUTE_TABLEAU_DE_BORD[session.user.role]);
}
