"use client";
import { useState } from "react";
export default function FormulaireVerification() {
  const [empreinte, setEmpreinte] = useState(""); const [signature, setSignature] = useState("");
  const [resultat, setResultat] = useState<null | boolean>(null); const [enCours, setEnCours] = useState(false);
  async function verifier(e: React.FormEvent) {
    e.preventDefault(); setEnCours(true); setResultat(null);
    try {
      const res = await fetch("/api/verification-signature", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ empreinte, signature }) });
      setResultat(Boolean((await res.json()).valide));
    } finally { setEnCours(false); }
  }
  return (
    <form onSubmit={verifier} className="mt-4 space-y-3 rounded-lg border border-trait bg-carte p-4">
      <label className="flex flex-col gap-1 text-sm font-bold">Empreinte (SHA-256, hexadécimal)<input value={empreinte} onChange={(e) => setEmpreinte(e.target.value)} required className="rounded-md border-2 border-trait px-3 py-2 font-mono text-xs font-normal" /></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Signature (Ed25519, base64)<input value={signature} onChange={(e) => setSignature(e.target.value)} required className="rounded-md border-2 border-trait px-3 py-2 font-mono text-xs font-normal" /></label>
      <button type="submit" disabled={enCours} className="rounded-md border-2 border-encre bg-jaune px-4 py-2 font-bold text-encre disabled:opacity-60">{enCours ? "Vérification…" : "Vérifier"}</button>
      {resultat !== null && <p role="status" className={`font-bold ${resultat ? "text-vert-fonce" : "text-rouge"}`}>{resultat ? "✅ Signature valide." : "❌ Signature invalide."}</p>}
    </form>
  );
}
