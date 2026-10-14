const NOMBRE = new Intl.NumberFormat("fr-FR");
export const fcfa = (n: number | null | undefined) => (n == null ? "-" : `${NOMBRE.format(Math.round(n))} FCFA`);
export const m2 = (n: number) => `${NOMBRE.format(Math.round(n))} m²`;
export const dateFr = (d: Date | string | null | undefined) => (d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "-");
export const dateHeureFr = (d: Date | string) => new Date(d).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
