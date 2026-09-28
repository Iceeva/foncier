export type Point = [number, number];
const METRES_PAR_DEGRE = 111_320;

export function rectangle(lat: number, lng: number, largeurM: number, longueurM: number): Point[] {
  const dLat = longueurM / 2 / METRES_PAR_DEGRE;
  const dLng = largeurM / 2 / (METRES_PAR_DEGRE * Math.cos((lat * Math.PI) / 180));
  return [[lat - dLat, lng - dLng], [lat - dLat, lng + dLng], [lat + dLat, lng + dLng], [lat + dLat, lng - dLng]];
}
export function versMetres(poly: Point[], origine: Point = poly[0]): [number, number][] {
  const [lat0, lng0] = origine;
  const kx = METRES_PAR_DEGRE * Math.cos((lat0 * Math.PI) / 180);
  return poly.map(([lat, lng]) => [(lng - lng0) * kx, (lat - lat0) * METRES_PAR_DEGRE]);
}
export function aireM2(poly: Point[]): number {
  const pts = versMetres(poly);
  let somme = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i]; const [x2, y2] = pts[(i + 1) % pts.length];
    somme += x1 * y2 - x2 * y1;
  }
  return Math.abs(somme) / 2;
}
export function englobant(poly: Point[]) {
  const lats = poly.map((p) => p[0]); const lngs = poly.map((p) => p[1]);
  return { latMin: Math.min(...lats), latMax: Math.max(...lats), lngMin: Math.min(...lngs), lngMax: Math.max(...lngs) };
}
function seRecoupent(a: ReturnType<typeof englobant>, b: ReturnType<typeof englobant>) {
  return a.latMin < b.latMax && a.latMax > b.latMin && a.lngMin < b.lngMax && a.lngMax > b.lngMin;
}
export function chevauchements<T extends { id: string; polygone: Point[] }>(cible: T, autres: T[]): T[] {
  const a = englobant(cible.polygone);
  return autres.filter((q) => q.id !== cible.id && seRecoupent(a, englobant(q.polygone)));
}
export const LIMITES_BENIN: [Point, Point] = [[6.15, 0.75], [12.45, 3.85]];
export const CENTRE_BENIN: Point = [9.3, 2.3];
