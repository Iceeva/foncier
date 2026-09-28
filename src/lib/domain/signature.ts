import { createPrivateKey, createPublicKey, sign, verify, generateKeyPairSync, createHash } from "node:crypto";
const IDENTIFIANT_CLE = "fonciersur-benin-v1";
function clePriveeDepuisEnv() {
  const b64 = process.env.PLATFORM_SIGNING_PRIVATE_KEY;
  if (!b64) throw new Error("PLATFORM_SIGNING_PRIVATE_KEY manquante (voir .env.example).");
  return createPrivateKey({ key: Buffer.from(b64, "base64"), format: "der", type: "pkcs8" });
}
function clePubliqueDepuisEnv() {
  const b64 = process.env.PLATFORM_SIGNING_PUBLIC_KEY;
  if (!b64) throw new Error("PLATFORM_SIGNING_PUBLIC_KEY manquante (voir .env.example).");
  return createPublicKey({ key: Buffer.from(b64, "base64"), format: "der", type: "spki" });
}
export function empreinte(texte: string): string { return createHash("sha256").update(texte).digest("hex"); }
export function signerEmpreinte(empreinteHex: string): { signature: string; signePar: string } {
  const cle = clePriveeDepuisEnv();
  const signature = sign(null, Buffer.from(empreinteHex, "hex"), cle);
  return { signature: signature.toString("base64"), signePar: IDENTIFIANT_CLE };
}
export function verifierSignature(empreinteHex: string, signatureB64: string): boolean {
  try {
    const cle = clePubliqueDepuisEnv();
    return verify(null, Buffer.from(empreinteHex, "hex"), cle, Buffer.from(signatureB64, "base64"));
  } catch { return false; }
}
export function clePubliquePem(): string { return clePubliqueDepuisEnv().export({ format: "pem", type: "spki" }).toString(); }
export function genererPaireDeCles(): { prive: string; publique: string } {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  return { prive: privateKey.export({ format: "der", type: "pkcs8" }).toString("base64"), publique: publicKey.export({ format: "der", type: "spki" }).toString("base64") };
}
