import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

const identifiants = z.object({ email: z.string().email(), motDePasse: z.string().min(1) });

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: { label: "Adresse e-mail", type: "email" }, motDePasse: { label: "Mot de passe", type: "password" } },
      async authorize(credentials) {
        const champs = identifiants.safeParse(credentials);
        if (!champs.success) return null;
        const { email, motDePasse } = champs.data;
        const utilisateur = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
        if (!utilisateur || !utilisateur.actif) return null;
        const ok = await bcrypt.compare(motDePasse, utilisateur.motDePasseHash);
        if (!ok) return null;
        return { id: utilisateur.id, name: utilisateur.nom, email: utilisateur.email, role: utilisateur.role };
      },
    }),
  ],
});
