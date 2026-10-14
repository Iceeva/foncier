"use client";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { LIMITES_BENIN } from "@/lib/domain/geo";
import { STATUT_PARCELLE_LABELS, USAGE_LABELS } from "@/lib/domain/refs";
import { fcfa, m2 } from "@/lib/format";
import type { StatutParcelle, UsageParcelle } from "@/generated/prisma/enums";
export type ParcelleCarte = { id: string; quartier: string; polygone: [number, number][]; statut: StatutParcelle; usage: UsageParcelle; superficie: number; prix: number | null };
export default function CarteParcelles({ parcelles, focusId }: { parcelles: ParcelleCarte[]; focusId?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const carteRef = useRef<L.Map | null>(null);
  useEffect(() => {
    if (!divRef.current || carteRef.current) return;
    const carte = L.map(divRef.current, { scrollWheelZoom: false, maxBounds: L.latLngBounds(LIMITES_BENIN).pad(0.15), minZoom: 6 }).fitBounds(LIMITES_BENIN);
    carteRef.current = carte;
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© contributeurs OpenStreetMap" }).addTo(carte);
    const groupe = L.featureGroup();
    for (const p of parcelles) {
      const s = STATUT_PARCELLE_LABELS[p.statut]; const enFocus = p.id === focusId;
      L.polygon(p.polygone, { color: s.couleur, weight: enFocus ? 4 : 2, fillOpacity: enFocus ? 0.45 : 0.25 }).addTo(groupe);
      const centreLat = p.polygone.reduce((s, pt) => s + pt[0], 0) / p.polygone.length;
      const centreLng = p.polygone.reduce((s, pt) => s + pt[1], 0) / p.polygone.length;
      const popup = `<strong>${p.id}</strong> - ${p.quartier}<br>${USAGE_LABELS[p.usage]} · ${m2(p.superficie)}<br>${p.prix ? fcfa(p.prix) : "Prix non renseigné"}<br>${s.label}<br><a href="/parcelles/${p.id}">Ouvrir la fiche</a>`;
      L.marker([centreLat, centreLng], { title: `${p.id} - ${p.quartier} - ${s.label}`, alt: `Parcelle ${p.id}, ${s.label}`, icon: L.divIcon({ className: "fsb-pin", html: `<span style="--c:${s.couleur}"></span>`, iconSize: [26, 26] }) }).bindPopup(popup).addTo(groupe);
    }
    groupe.addTo(carte);
    if (parcelles.length) {
      const cible = focusId ? parcelles.find((p) => p.id === focusId) : null;
      carte.fitBounds(cible ? L.polygon(cible.polygone).getBounds().pad(1.5) : groupe.getBounds().pad(0.2), { maxZoom: 18 });
    }
    const Recentrer = L.Control.extend({ onAdd() {
      const btn = L.DomUtil.create("button", "fsb-btn-recentrer"); btn.type = "button"; btn.innerHTML = "🇧🇯 Bénin entier";
      btn.setAttribute("aria-label", "Recentrer la carte sur le Bénin entier");
      L.DomEvent.on(btn, "click", L.DomEvent.stop).on(btn, "click", () => carte.fitBounds(LIMITES_BENIN));
      return btn;
    } });
    new Recentrer({ position: "topright" }).addTo(carte);
    return () => { carte.remove(); carteRef.current = null; };
  }, [parcelles, focusId]);
  return (
    <>
      <div ref={divRef} className="h-[480px] w-full rounded-lg border-2 border-trait" role="region" aria-label="Carte des parcelles" />
      <ul className="mt-3 flex flex-wrap gap-4 text-sm" aria-label="Légende">
        {Object.values(STATUT_PARCELLE_LABELS).map((s) => <li key={s.label} className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full border-2" style={{ borderColor: s.couleur, background: `${s.couleur}33` }} />{s.label}</li>)}
      </ul>
      <noscript><ul className="mt-4 list-inside list-disc">{parcelles.map((p) => <li key={p.id}><Link href={`/parcelles/${p.id}`}>{p.id} - {p.quartier}</Link></li>)}</ul></noscript>
    </>
  );
}
