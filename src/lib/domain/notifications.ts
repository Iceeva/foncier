import { prisma } from "@/lib/prisma";
export async function notifier(userIds: string[], message: string, lien: string) {
  const ids = [...new Set(userIds)].filter(Boolean);
  if (ids.length === 0) return;
  await prisma.notification.createMany({ data: ids.map((userId) => ({ userId, message, lien })) });
}
export const notificationsRecentes = (userId: string, take = 6) => prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take });
export const compterNonLues = (userId: string) => prisma.notification.count({ where: { userId, lue: false } });
