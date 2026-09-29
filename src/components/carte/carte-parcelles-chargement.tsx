"use client";
import dynamic from "next/dynamic";
import type { ParcelleCarte } from "./carte-parcelles";
const CarteParcelles = dynamic(() => import("./carte-parcelles"), { ssr: false, loading: () => <div className="flex h-[480px] items-center justify-center rounded-lg border-2 border-trait bg-vert-clair text-texte-doux">Chargement de la carte…</div> });
export default function CarteParcellesChargement(props: { parcelles: ParcelleCarte[]; focusId?: string }) { return <CarteParcelles {...props} />; }
