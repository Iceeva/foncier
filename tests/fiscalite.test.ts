import { describe, it, expect } from "vitest";
import { impotsAJour } from "@/lib/domain/fiscalite";
describe("fiscalité", () => {
  it("impôts à jour si quitus sans expiration", () => { expect(impotsAJour([{ type: "QUITUS", expire: null } as never])).toBe(true); });
  it("impôts non à jour si quitus expiré", () => { expect(impotsAJour([{ type: "QUITUS", expire: new Date("2000-01-01") } as never])).toBe(false); });
  it("impôts non à jour si aucun quitus", () => { expect(impotsAJour([{ type: "TF", expire: null } as never])).toBe(false); });
});
