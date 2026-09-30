import Link from "next/link";
import { BellFill } from "react-bootstrap-icons";
import { auth } from "@/lib/auth";
import { compterNonLues } from "@/lib/domain/notifications";
export default async function ClocheNotifications() {
  const session = await auth();
  if (!session?.user) return null;
  const n = await compterNonLues(session.user.id);
  return (
    <Link href="/tableau-de-bord/notifications" className="relative rounded-md p-2 text-encre hover:bg-vert-clair" aria-label={`Notifications${n ? `, ${n} non lue(s)` : ""}`}>
      <BellFill aria-hidden />
      {n > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-rouge px-1.5 text-xs font-bold text-white">{n}</span>}
    </Link>
  );
}
