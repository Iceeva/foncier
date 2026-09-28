import { describe, it, expect } from "vitest";
import { rectangle, aireM2, chevauchements } from "@/lib/domain/geo";
describe("géométrie", () => {
  it("un rectangle de 20 m x 30 m fait environ 600 m²", () => { expect(Math.abs(aireM2(rectangle(6.4, 2.3, 20, 30)) - 600)).toBeLessThan(1); });
  it("détecte deux polygones qui se chevauchent", () => {
    const a = { id: "A", polygone: rectangle(6.46, 2.335, 30, 30) };
    const b = { id: "B", polygone: rectangle(6.46, 2.335136, 30, 30) };
    const c = { id: "C", polygone: rectangle(7.0, 2.0, 30, 30) };
    expect(chevauchements(a, [b, c]).map((x) => x.id)).toEqual(["B"]);
  });
});
