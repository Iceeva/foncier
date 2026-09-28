import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // L'application est délibérément dynamique à chaque requête (session,
  // données Postgres en temps réel) : le nouveau mode « Cache Components »
  // de Next.js, activé par défaut par create-next-app, est désactivé ici.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
