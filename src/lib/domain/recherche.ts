import type { Prisma } from "@/generated/prisma/client";
import type { StatutParcelle, UsageParcelle } from "@/generated/prisma/enums";

export type CriteresRecherche = {
  q?: string; commune?: string; usage?: UsageParcelle; statut?: StatutParcelle;
  prixMin?: number; prixMax?: number; surfMin?: number; surfMax?: number;
  impot?: "oui" | "non"; vue?: "liste" | "carte";
  tri?: "prix_asc" | "prix_desc" | "surface_asc" | "surface_desc";
};
const USAGES_VALIDES: UsageParcelle[] = ["RESIDENTIEL", "COMMERCIAL", "AGRICOLE", "TOURISTIQUE", "INDUSTRIEL"];
const STATUTS_VALIDES: StatutParcelle[] = ["EN_VENTE", "HORS_VENTE", "EN_COURS", "LITIGE"];

export function lireCriteres(sp: Record<string, string | string[] | undefined>): CriteresRecherche {
  const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const c: CriteresRecherche = {};
  const q = str(sp.q); if (q) c.q = q;
  const commune = str(sp.commune); if (commune) c.commune = commune;
  const usage = str(sp.usage); if (usage && USAGES_VALIDES.includes(usage as UsageParcelle)) c.usage = usage as UsageParcelle;
  const statut = str(sp.statut); if (statut && STATUTS_VALIDES.includes(statut as StatutParcelle)) c.statut = statut as StatutParcelle;
  const prixMin = str(sp.prixMin); if (prixMin) c.prixMin = Number(prixMin);
  const prixMax = str(sp.prixMax); if (prixMax) c.prixMax = Number(prixMax);
  const surfMin = str(sp.surfMin); if (surfMin) c.surfMin = Number(surfMin);
  const surfMax = str(sp.surfMax); if (surfMax) c.surfMax = Number(surfMax);
  const impot = str(sp.impot); if (impot === "oui" || impot === "non") c.impot = impot;
  const vue = str(sp.vue); if (vue === "carte") c.vue = "carte";
  const tri = str(sp.tri); if (tri) c.tri = tri as CriteresRecherche["tri"];
  return c;
}

export function versWhereParcelle(c: CriteresRecherche): Prisma.ParcelleWhereInput {
  const where: Prisma.ParcelleWhereInput = {};
  if (c.q) {
    where.OR = [
      { id: { contains: c.q, mode: "insensitive" } }, { quartier: { contains: c.q, mode: "insensitive" } },
      { description: { contains: c.q, mode: "insensitive" } }, { commune: { nom: { contains: c.q, mode: "insensitive" } } },
      { proprietaire: { nom: { contains: c.q, mode: "insensitive" } } },
    ];
  }
  if (c.commune) where.commune = { nom: c.commune };
  if (c.usage) where.usage = c.usage;
  if (c.statut) where.statut = c.statut;
  if (c.prixMin || c.prixMax) where.prix = { not: null, ...(c.prixMin ? { gte: c.prixMin } : {}), ...(c.prixMax ? { lte: c.prixMax } : {}) };
  if (c.surfMin || c.surfMax) where.superficie = { ...(c.surfMin ? { gte: c.surfMin } : {}), ...(c.surfMax ? { lte: c.surfMax } : {}) };
  if (c.impot === "oui") where.documents = { some: { type: "QUITUS", OR: [{ expire: null }, { expire: { gte: new Date() } }] } };
  else if (c.impot === "non") where.NOT = { documents: { some: { type: "QUITUS", OR: [{ expire: null }, { expire: { gte: new Date() } }] } } };
  return where;
}

export function versOrderBy(tri?: CriteresRecherche["tri"]): Prisma.ParcelleOrderByWithRelationInput[] {
  switch (tri) {
    case "prix_asc": return [{ prix: { sort: "asc", nulls: "last" } }];
    case "prix_desc": return [{ prix: { sort: "desc", nulls: "last" } }];
    case "surface_asc": return [{ superficie: "asc" }];
    case "surface_desc": return [{ superficie: "desc" }];
    default: return [{ createdAt: "desc" }];
  }
}

export function versQueryString(c: CriteresRecherche): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(c)) if (v !== undefined && v !== "") sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : "";
}
