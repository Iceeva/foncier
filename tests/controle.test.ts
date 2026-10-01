import { describe, it, expect } from "vitest";
import { controleComplet, POINTS_CONTROLE } from "@/lib/domain/controle";
describe("checklist de contrôle", () => {
  it("vide = incomplet", () => { expect(controleComplet({})).toBe(false); });
  it("5 points sur 6 = incomplet", () => {
    const c = Object.fromEntries(POINTS_CONTROLE.slice(0, 5).map((p) => [p.id, true]));
    expect(controleComplet(c)).toBe(false);
  });
  it("6 points = complet", () => {
    expect(controleComplet(Object.fromEntries(POINTS_CONTROLE.map((p) => [p.id, true])))).toBe(true);
  });
});
