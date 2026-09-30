import type { Metadata } from "next";
import Link from "next/link";
import { BellFill } from "react-bootstrap-icons";
import { prisma } from "@/lib/prisma";
import { exigerSession } from "@/lib/session";
import { dateHeureFr } from "@/lib/format";
import BoutonToutLu from "./bouton-tout-lu";
export const metadata: Metadata = { title: "Notifications" };
export default async function PageNotifications() {
  const session = await exigerSession();
  const notifications = await prisma.notification.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-encre"><BellFill aria-hidden /> Notifications</h1>
        {notifications.some((n) => !n.lue) && <BoutonToutLu />}
      </div>
      {notifications.length === 0 ? (
        <p className="mt-4 rounded-lg border-2 border-dashed border-trait bg-white p-6 text-center text-texte-doux">Aucune notification pour l&apos;instant.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {notifications.map((n) => (
            <li key={n.id} className={`rounded-md p-3 ${n.lue ? "bg-white" : "bg-vert-clair font-bold"}`}>
              <Link href={n.lien} className="text-encre hover:underline">{n.message}</Link>
              <div className="text-xs font-normal text-texte-doux">{dateHeureFr(n.createdAt)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
