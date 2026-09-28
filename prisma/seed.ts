import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { COMMUNES } from "../src/lib/domain/refs";
import { rectangle, aireM2, type Point } from "../src/lib/domain/geo";
import { empreinte, signerEmpreinte } from "../src/lib/domain/signature";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const MOT_DE_PASSE_DEMO = "Demo1234!";

type UtilisateurSeed = { email: string; nom: string; role: "ADMIN" | "AGENT" | "NOTAIRE" | "GEOMETRE" | "PROPRIETAIRE" | "ACHETEUR"; telephone: string };
const UTILISATEURS: UtilisateurSeed[] = [
  { email: "admin@fonciersur.bj", nom: "Administrateur FoncierSûr", role: "ADMIN", telephone: "+229 0100000000" },
  { email: "fatoumata.adjovi@fonciersur.bj", nom: "Fatoumata Adjovi", role: "AGENT", telephone: "+229 0100000001" },
  { email: "basile.ahouandjinou@fonciersur.bj", nom: "Basile Ahouandjinou", role: "AGENT", telephone: "+229 0100000002" },
  { email: "koffi.dossou@notaires.bj", nom: "Me Koffi Dossou", role: "NOTAIRE", telephone: "+229 0100000003" },
  { email: "rachida.sabi@notaires.bj", nom: "Me Rachida Sabi", role: "NOTAIRE", telephone: "+229 0100000004" },
  { email: "yao.hounsou@geometres.bj", nom: "Yao Hounsou", role: "GEOMETRE", telephone: "+229 0100000005" },
  { email: "senami.agossou@gmail.com", nom: "Sènami Agossou", role: "PROPRIETAIRE", telephone: "+229 0100000010" },
  { email: "codjo.tossou@gmail.com", nom: "Codjo Tossou", role: "PROPRIETAIRE", telephone: "+229 0100000011" },
  { email: "aicha.bio@gmail.com", nom: "Aïcha Bio", role: "PROPRIETAIRE", telephone: "+229 0100000012" },
  { email: "romeo.gbaguidi@gmail.com", nom: "Roméo Gbaguidi", role: "PROPRIETAIRE", telephone: "+229 0100000013" },
  { email: "ephrem.koudjo@gmail.com", nom: "Ephrem Koudjo", role: "PROPRIETAIRE", telephone: "+229 0100000014" },
  { email: "paulin.hounkpatin@gmail.com", nom: "Paulin Hounkpatin", role: "PROPRIETAIRE", telephone: "+229 0100000015" },
  { email: "leonce.dossa@gmail.com", nom: "Léonce Dossa", role: "PROPRIETAIRE", telephone: "+229 0100000016" },
  { email: "mireille.zinsou@gmail.com", nom: "Mireille Zinsou", role: "PROPRIETAIRE", telephone: "+229 0100000017" },
  { email: "marius.degnon@gmail.com", nom: "Marius Dègnon", role: "ACHETEUR", telephone: "+229 0100000020" },
  { email: "nadege.akpo@gmail.com", nom: "Nadège Akpo", role: "ACHETEUR", telephone: "+229 0100000021" },
  { email: "judicael.sagbo@gmail.com", nom: "Judicaël Sagbo", role: "ACHETEUR", telephone: "+229 0100000022" },
];

type ParcelleSeed = { id: string; commune: string; quartier: string; lat: number; lng: number; largeur: number; longueur: number; usage: "RESIDENTIEL" | "COMMERCIAL" | "AGRICOLE" | "TOURISTIQUE" | "INDUSTRIEL"; statut: "EN_VENTE" | "HORS_VENTE" | "EN_COURS" | "LITIGE"; prix: number | null; proprietaire: string; description: string };
const PARCELLES: ParcelleSeed[] = [
  { id: "CAL-0001", commune: "Abomey-Calavi", quartier: "Godomey", lat: 6.393, lng: 2.344, largeur: 20, longueur: 30, usage: "RESIDENTIEL", statut: "EN_VENTE", prix: 6_500_000, proprietaire: "senami.agossou@gmail.com", description: "Terrain plat, proche de la route bitumée. Eau et électricité à proximité." },
  { id: "CAL-0002", commune: "Abomey-Calavi", quartier: "Togba", lat: 6.456, lng: 2.324, largeur: 25, longueur: 40, usage: "RESIDENTIEL", statut: "EN_VENTE", prix: 9_800_000, proprietaire: "codjo.tossou@gmail.com", description: "Grand terrain d'angle dans un lotissement en cours de viabilisation." },
  { id: "CAL-0003", commune: "Abomey-Calavi", quartier: "Zinvié", lat: 6.501, lng: 2.285, largeur: 100, longueur: 200, usage: "AGRICOLE", statut: "EN_VENTE", prix: 12_000_000, proprietaire: "aicha.bio@gmail.com", description: "Deux hectares cultivables, sol sablo-argileux, accès par piste." },
  { id: "CAL-0004", commune: "Abomey-Calavi", quartier: "Tankpè", lat: 6.46, lng: 2.335, largeur: 30, longueur: 30, usage: "RESIDENTIEL", statut: "LITIGE", prix: 8_200_000, proprietaire: "romeo.gbaguidi@gmail.com", description: "Terrain signalé en litige de limites avec son voisin." },
  { id: "CAL-0005", commune: "Abomey-Calavi", quartier: "Tankpè", lat: 6.46, lng: 2.335136, largeur: 30, longueur: 30, usage: "RESIDENTIEL", statut: "EN_VENTE", prix: 8_500_000, proprietaire: "ephrem.koudjo@gmail.com", description: "Terrain nu, clôture partielle." },
  { id: "COT-0001", commune: "Cotonou", quartier: "Fidjrossè", lat: 6.356, lng: 2.372, largeur: 15, longueur: 20, usage: "RESIDENTIEL", statut: "EN_VENTE", prix: 25_000_000, proprietaire: "senami.agossou@gmail.com", description: "Parcelle proche de la plage, quartier calme." },
  { id: "COT-0002", commune: "Cotonou", quartier: "Akpakpa", lat: 6.36, lng: 2.445, largeur: 20, longueur: 20, usage: "COMMERCIAL", statut: "EN_VENTE", prix: 40_000_000, proprietaire: "paulin.hounkpatin@gmail.com", description: "Emplacement commercial sur axe très passant." },
  { id: "COT-0003", commune: "Cotonou", quartier: "Cadjèhoun", lat: 6.362, lng: 2.385, largeur: 25, longueur: 25, usage: "RESIDENTIEL", statut: "HORS_VENTE", prix: null, proprietaire: "mireille.zinsou@gmail.com", description: "Maison familiale, non proposée à la vente." },
  { id: "PNO-0001", commune: "Porto-Novo", quartier: "Ouando", lat: 6.503, lng: 2.615, largeur: 20, longueur: 25, usage: "RESIDENTIEL", statut: "EN_VENTE", prix: 7_200_000, proprietaire: "paulin.hounkpatin@gmail.com", description: "Terrain viabilisé, proche du marché." },
  { id: "PNO-0002", commune: "Porto-Novo", quartier: "Djègan-Kpèvi", lat: 6.482, lng: 2.643, largeur: 30, longueur: 30, usage: "RESIDENTIEL", statut: "EN_VENTE", prix: 9_000_000, proprietaire: "romeo.gbaguidi@gmail.com", description: "Terrain rectangulaire, titre foncier disponible." },
  { id: "PAR-0001", commune: "Parakou", quartier: "Banikanni", lat: 9.345, lng: 2.618, largeur: 25, longueur: 30, usage: "RESIDENTIEL", statut: "EN_VENTE", prix: 4_800_000, proprietaire: "codjo.tossou@gmail.com", description: "Terrain dans un quartier résidentiel en expansion." },
  { id: "PAR-0002", commune: "Parakou", quartier: "Zongo", lat: 9.312, lng: 2.648, largeur: 120, longueur: 150, usage: "AGRICOLE", statut: "EN_VENTE", prix: 15_000_000, proprietaire: "mireille.zinsou@gmail.com", description: "Terre agricole de 1,8 ha, adaptée au maïs et au soja." },
  { id: "OUI-0001", commune: "Ouidah", quartier: "Plage de Ouidah", lat: 6.339, lng: 2.088, largeur: 30, longueur: 50, usage: "TOURISTIQUE", statut: "EN_VENTE", prix: 45_000_000, proprietaire: "aicha.bio@gmail.com", description: "Terrain proche du littoral, projet hôtelier possible." },
  { id: "SEM-0001", commune: "Sèmè-Podji", quartier: "Agblangandan", lat: 6.389, lng: 2.52, largeur: 20, longueur: 30, usage: "RESIDENTIEL", statut: "EN_VENTE", prix: 5_600_000, proprietaire: "ephrem.koudjo@gmail.com", description: "Terrain sec, proche de la route inter-États." },
  { id: "BOH-0001", commune: "Bohicon", quartier: "Centre", lat: 7.175, lng: 2.07, largeur: 40, longueur: 50, usage: "COMMERCIAL", statut: "EN_VENTE", prix: 18_000_000, proprietaire: "leonce.dossa@gmail.com", description: "Grand terrain près du carrefour des routes nationales." },
];

type DocumentSeed = { parcelleId: string; type: "TF" | "PLAN" | "BORNAGE" | "CERT_APPARTENANCE" | "QUITUS" | "CONVENTION" | "ACTE_NOTARIE" | "HYPOTHEQUE"; numero: string; titulaire: string; date: string; expire?: string; montant?: number; beneficiaire?: string; banque?: string };
function dossierComplet(parcelleId: string, n: number, commune: string, titulaire: string): DocumentSeed[] {
  const code = COMMUNES[commune].code;
  const num = (prefixe: string) => `${prefixe}-${String(n).padStart(5, "0")}-${code}`;
  return [
    { parcelleId, type: "TF", numero: num("TF"), titulaire, date: "2022-01-10" },
    { parcelleId, type: "PLAN", numero: num("PL"), titulaire, date: "2022-02-10" },
    { parcelleId, type: "BORNAGE", numero: num("BN"), titulaire, date: "2022-03-10" },
    { parcelleId, type: "CERT_APPARTENANCE", numero: num("CA"), titulaire, date: "2022-04-10" },
    { parcelleId, type: "QUITUS", numero: num("QF"), titulaire, date: "2025-05-10", expire: "2030-12-31" },
  ];
}
const DOCUMENTS: DocumentSeed[] = [
  ...dossierComplet("CAL-0001", 1, "Abomey-Calavi", "senami.agossou@gmail.com"),
  ...dossierComplet("CAL-0002", 2, "Abomey-Calavi", "codjo.tossou@gmail.com").filter((d) => d.type !== "BORNAGE"),
  ...dossierComplet("CAL-0003", 3, "Abomey-Calavi", "aicha.bio@gmail.com"),
  ...dossierComplet("CAL-0004", 4, "Abomey-Calavi", "romeo.gbaguidi@gmail.com"),
  ...dossierComplet("CAL-0005", 5, "Abomey-Calavi", "ephrem.koudjo@gmail.com"),
  ...dossierComplet("COT-0001", 6, "Cotonou", "senami.agossou@gmail.com"),
  ...dossierComplet("COT-0002", 7, "Cotonou", "paulin.hounkpatin@gmail.com").map((d) => (d.type === "TF" ? { ...d, titulaire: "leonce.dossa@gmail.com" } : d)),
  ...dossierComplet("COT-0003", 8, "Cotonou", "mireille.zinsou@gmail.com"),
  { parcelleId: "COT-0003", type: "HYPOTHEQUE", numero: "HY-00008-COT", titulaire: "mireille.zinsou@gmail.com", date: "2024-06-01", montant: 12_000_000, banque: "Banque Atlantique Bénin" },
  ...dossierComplet("PNO-0001", 9, "Porto-Novo", "paulin.hounkpatin@gmail.com"),
  ...dossierComplet("PNO-0002", 10, "Porto-Novo", "romeo.gbaguidi@gmail.com"),
  { parcelleId: "PNO-0002", type: "CONVENTION", numero: "CV-00010-PNO", titulaire: "romeo.gbaguidi@gmail.com", date: "2024-02-10", montant: 9_000_000, beneficiaire: "marius.degnon@gmail.com" },
  { parcelleId: "PNO-0002", type: "CONVENTION", numero: "CV-00011-PNO", titulaire: "romeo.gbaguidi@gmail.com", date: "2024-03-05", montant: 9_200_000, beneficiaire: "judicael.sagbo@gmail.com" },
  ...dossierComplet("PAR-0001", 12, "Parakou", "codjo.tossou@gmail.com"),
  ...dossierComplet("PAR-0002", 13, "Parakou", "mireille.zinsou@gmail.com").map((d) => (d.type === "CERT_APPARTENANCE" ? { ...d, expire: "2025-06-30" } : d)),
  ...dossierComplet("OUI-0001", 14, "Ouidah", "aicha.bio@gmail.com"),
  ...dossierComplet("SEM-0001", 15, "Sèmè-Podji", "ephrem.koudjo@gmail.com"),
  ...dossierComplet("BOH-0001", 16, "Bohicon", "leonce.dossa@gmail.com").map((d) => (d.type === "QUITUS" ? { ...d, expire: "2025-01-01" } : d)),
];

async function main() {
  console.log("Seed — communes…");
  for (const [nom, info] of Object.entries(COMMUNES)) {
    await prisma.commune.upsert({ where: { nom }, update: {}, create: { nom, code: info.code, centreLat: info.centreLat, centreLng: info.centreLng } });
  }
  const communes = await prisma.commune.findMany();
  const idCommune = new Map(communes.map((c) => [c.nom, c.id]));

  console.log("Seed — utilisateurs…");
  const hash = await bcrypt.hash(MOT_DE_PASSE_DEMO, 12);
  for (const u of UTILISATEURS) await prisma.user.upsert({ where: { email: u.email }, update: {}, create: { ...u, motDePasseHash: hash } });
  const users = await prisma.user.findMany();
  const idUser = new Map(users.map((u) => [u.email, u.id]));

  console.log("Seed — parcelles…");
  for (const p of PARCELLES) {
    const polygone: Point[] = rectangle(p.lat, p.lng, p.largeur, p.longueur);
    const superficie = Math.round(aireM2(polygone));
    await prisma.parcelle.upsert({
      where: { id: p.id }, update: {},
      create: { id: p.id, communeId: idCommune.get(p.commune)!, quartier: p.quartier, lat: p.lat, lng: p.lng, largeur: p.largeur, longueur: p.longueur, polygone, superficie, usage: p.usage, statut: p.statut, prix: p.prix, description: p.description, proprietaireId: idUser.get(p.proprietaire)! },
    });
  }

  console.log("Seed — documents (signés Ed25519)…");
  for (const d of DOCUMENTS) {
    const titulaireId = idUser.get(d.titulaire)!;
    const beneficiaireId = d.beneficiaire ? idUser.get(d.beneficiaire)! : null;
    const donnees = `${d.numero}|${d.type}|${d.parcelleId}|${titulaireId}|${d.date}|${d.montant ?? ""}|${beneficiaireId ?? ""}`;
    const empreinteDonnees = empreinte(donnees);
    const { signature, signePar } = signerEmpreinte(empreinteDonnees);
    await prisma.document.upsert({
      where: { numero: d.numero }, update: {},
      create: { parcelleId: d.parcelleId, type: d.type, numero: d.numero, titulaireId, date: new Date(d.date), expire: d.expire ? new Date(d.expire) : null, montant: d.montant ?? null, beneficiaireId, banque: d.banque ?? null, empreinteDonnees, signature, signePar },
    });
  }

  console.log(`✔ ${Object.keys(COMMUNES).length} communes, ${UTILISATEURS.length} utilisateurs, ${PARCELLES.length} parcelles, ${DOCUMENTS.length} documents signés.`);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
