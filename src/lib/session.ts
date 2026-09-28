import { redirect } from "next/navigation";
import type { Role } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { ROUTE_TABLEAU_DE_BORD } from "@/lib/domain/refs";
export async function exigerSession() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  return session;
}
export async function exigerRole(...roles: Role[]) {
  const session = await exigerSession();
  if (!roles.includes(session.user.role)) redirect(ROUTE_TABLEAU_DE_BORD[session.user.role]);
  return session;
}
