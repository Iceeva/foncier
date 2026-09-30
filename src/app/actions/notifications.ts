"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { exigerSession } from "@/lib/session";
export async function marquerLueAction(id: string) {
  const session = await exigerSession();
  await prisma.notification.updateMany({ where: { id, userId: session.user.id }, data: { lue: true } });
  revalidatePath("/tableau-de-bord/notifications");
}
export async function marquerToutLuAction() {
  const session = await exigerSession();
  await prisma.notification.updateMany({ where: { userId: session.user.id, lue: false }, data: { lue: true } });
  revalidatePath("/tableau-de-bord/notifications");
}
