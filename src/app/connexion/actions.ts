"use server";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
export type EtatConnexion = { erreur?: string };
export async function connecterAction(_etat: EtatConnexion, formData: FormData): Promise<EtatConnexion> {
  try {
    await signIn("credentials", { email: formData.get("email"), motDePasse: formData.get("motDePasse"), redirectTo: "/tableau-de-bord" });
    return {};
  } catch (erreur) {
    if (erreur instanceof AuthError) return { erreur: "Adresse e-mail ou mot de passe incorrect." };
    throw erreur;
  }
}
