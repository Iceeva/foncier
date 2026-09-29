import { Receipt } from "react-bootstrap-icons";
export default function BadgeImpot({ aJour }: { aJour: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-0.5 text-sm font-bold ${aJour ? "border-vert bg-vert-clair text-vert-fonce" : "border-rouge bg-red-50 text-rouge"}`}>
      <Receipt aria-hidden />{aJour ? "Impôts à jour" : "Impôts non à jour"}
    </span>
  );
}
