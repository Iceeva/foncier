import { STATUT_PARCELLE_LABELS } from "@/lib/domain/refs";
import type { StatutParcelle } from "@/generated/prisma/enums";
export default function BadgeStatut({ statut }: { statut: StatutParcelle }) {
  const s = STATUT_PARCELLE_LABELS[statut]; const Icone = s.icone;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border-2 bg-white px-2.5 py-0.5 text-sm font-bold" style={{ borderColor: s.couleur, color: s.couleur }}>
      <Icone aria-hidden size={12} />{s.label}
    </span>
  );
}
