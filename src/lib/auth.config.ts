import type { NextAuthConfig, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Role } from "@/generated/prisma/enums";
import { ROUTE_TABLEAU_DE_BORD } from "@/lib/domain/refs";

export const authConfig = {
  pages: { signIn: "/connexion" },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const connecte = user as { id: string; role: Role };
        token.id = connecte.id; token.role = connecte.role;
      }
      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id; session.user.role = token.role;
      return session;
    },
    authorized({ auth, request }) {
      const estConnecte = Boolean(auth?.user);
      const { pathname } = request.nextUrl;
      const estZoneProtegee = pathname.startsWith("/tableau-de-bord");
      if (estZoneProtegee) return estConnecte;
      if (pathname === "/connexion" && estConnecte) {
        const destination = ROUTE_TABLEAU_DE_BORD[auth!.user.role];
        return Response.redirect(new URL(destination, request.nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
