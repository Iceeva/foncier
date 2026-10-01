"use client";
// Panneau d'accessibilité ancré à droite, avec bouton d'ouverture (♿) et
// bouton de fermeture explicite. Réglages mémorisés (localStorage).
import { useEffect, useState } from "react";
import { UniversalAccess, XLg } from "react-bootstrap-icons";

const CLE = "fsb:accessibilite:v1";
type Reglages = { taille: string; contraste: boolean };

function appliquer(r: Reglages) {
  document.documentElement.style.setProperty("--taille-texte", r.taille);
  document.documentElement.classList.toggle("contraste-eleve", r.contraste);
}

export default function PanneauAccessibilite() {
  const [ouvert, setOuvert] = useState(false);
  const [r, setR] = useState<Reglages>({ taille: "100%", contraste: false });

  useEffect(() => {
    try { const s = localStorage.getItem(CLE); if (s) { const v = JSON.parse(s) as Reglages; setR(v); appliquer(v); } } catch { /* stockage indisponible */ }
  }, []);
  useEffect(() => {
    const echap = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, []);

  const maj = (n: Reglages) => { setR(n); appliquer(n); try { localStorage.setItem(CLE, JSON.stringify(n)); } catch { /* ignore */ } };
  const lire = () => {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(document.getElementById("contenu")?.innerText ?? "");
    u.lang = "fr-FR"; speechSynthesis.cancel(); speechSynthesis.speak(u);
  };

  return (
    <>
      <button type="button" onClick={() => setOuvert(true)} aria-label="Ouvrir les réglages d'accessibilité" aria-expanded={ouvert} className="rounded-md p-2 text-encre hover:bg-vert-clair">
        <UniversalAccess size={20} aria-hidden />
      </button>
      {ouvert && (
        <aside role="dialog" aria-label="Accessibilité" className="fixed inset-y-0 right-0 z-50 grid w-[min(22rem,100vw)] content-start gap-4 border-l-2 border-trait bg-carte p-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Accessibilité</h2>
            <button type="button" onClick={() => setOuvert(false)} aria-label="Fermer les réglages d'accessibilité" className="flex items-center gap-1 rounded-md border-2 border-encre bg-white px-3 py-1.5 text-sm font-bold">
              <XLg aria-hidden /> Fermer
            </button>
          </div>
          <label className="flex flex-col gap-1 text-sm font-bold">Taille du texte
            <select value={r.taille} onChange={(e) => maj({ ...r, taille: e.target.value })} className="rounded-md border-2 border-trait px-3 py-2 font-normal">
              <option value="100%">Normale</option><option value="120%">Grande</option><option value="145%">Très grande</option>
            </select></label>
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={r.contraste} onChange={(e) => maj({ ...r, contraste: e.target.checked })} /> Contraste élevé</label>
          <button type="button" onClick={lire} className="rounded-md border-2 border-encre bg-white px-3 py-2 font-bold">🔊 Lire le contenu de la page</button>
        </aside>
      )}
    </>
  );
}
