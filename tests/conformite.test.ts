import { describe, it, expect } from "vitest";
import { analyserConformite, estAchetable } from "@/lib/domain/conformite";
const parcelle = { statut: "EN_VENTE" as const, proprietaireId: "u1" };
function doc(over: Partial<{ type: string; numero: string; titulaireId: string; expire: Date | null; statut: string; beneficiaireId: string | null }>) {
  return { type: "TF", numero: "TF-1", titulaireId: "u1", expire: null, statut: "valide", beneficiaireId: null, ...over } as never;
}
const dossierComplet = (titulaireId = "u1") => (["TF", "PLAN", "BORNAGE", "CERT_APPARTENANCE", "QUITUS"] as const).map((type) => doc({ type, titulaireId }));
describe("moteur de conformité", () => {
  it("un dossier complet et cohérent est achetable", () => { expect(estAchetable(analyserConformite(parcelle, dossierComplet()))).toBe(true); });
  it("détecte une pièce manquante (bornage)", () => {
    const docs = dossierComplet().filter((d) => d.type !== "BORNAGE");
    const a = analyserConformite(parcelle, docs);
    expect(a.some((x) => x.code === "piece_manquante")).toBe(true);
    expect(estAchetable(a)).toBe(false);
  });
  it("détecte des titulaires différents", () => {
    const docs = dossierComplet(); docs[0] = doc({ type: "TF", titulaireId: "u2" });
    expect(analyserConformite(parcelle, docs).some((x) => x.code === "titulaires_multiples")).toBe(true);
  });
  it("détecte la double vente", () => {
    const docs = [...dossierComplet(), doc({ type: "CONVENTION", beneficiaireId: "a1" }), doc({ type: "CONVENTION", beneficiaireId: "a2" })];
    expect(analyserConformite(parcelle, docs).some((x) => x.code === "double_vente")).toBe(true);
  });
  it("détecte un document expiré", () => {
    const docs = dossierComplet(); docs[4] = doc({ type: "QUITUS", expire: new Date("2000-01-01") });
    expect(analyserConformite(parcelle, docs).some((x) => x.code === "document_expire")).toBe(true);
  });
  it("détecte une hypothèque non radiée", () => {
    const docs = [...dossierComplet(), doc({ type: "HYPOTHEQUE", statut: "valide" })];
    expect(analyserConformite(parcelle, docs).some((x) => x.code === "hypotheque")).toBe(true);
  });
  it("un statut LITIGE est toujours bloquant", () => {
    const a = analyserConformite({ ...parcelle, statut: "LITIGE" }, dossierComplet());
    expect(a.some((x) => x.code === "statut_litige")).toBe(true); expect(estAchetable(a)).toBe(false);
  });
});
