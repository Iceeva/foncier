import type { Document } from "@/generated/prisma/client";
export function quitusValide(documents: Pick<Document, "type" | "expire">[], maintenant = new Date()): boolean {
  return documents.some((d) => d.type === "QUITUS" && (!d.expire || d.expire >= maintenant));
}
export const impotsAJour = quitusValide;
