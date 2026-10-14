# FoncierSûr Bénin - application React/Next.js

Plateforme de vérification et de sécurisation foncière - réécriture complète
en **Next.js (React) + PostgreSQL/Prisma**, avec authentification réelle et
redirection automatique de chaque utilisateur vers son tableau de bord.

> Projet de démonstration technique. Données fictives. Le volet paiement
> n'est pas implémenté : voir README, section « Ce qui n'est pas dans ce
> projet ».

## Démarrage local

```bash
npm install
cp .env.example .env        # DATABASE_URL, AUTH_SECRET, clés de signature
psql "$DATABASE_URL" -f prisma/migrations/0001_init/migration.sql
npm run db:seed
npm run dev
```

## Déploiement sur Vercel

1. Importer le dépôt - framework détecté automatiquement : **Next.js**.
2. Ajouter une base PostgreSQL (Vercel Postgres, Neon, Supabase…) et renseigner `DATABASE_URL`.
3. Renseigner `AUTH_SECRET` et les clés de signature (voir `.env.example`).
4. Le build exécute automatiquement `prisma generate` puis `next build`.
5. Exécuter `npx prisma migrate deploy` puis `npm run db:seed`.

## Fonctionnalités

- Authentification réelle (NextAuth + bcrypt), chaque profil est redirigé vers **son** tableau de bord.
- Recherche multicritère (requêtes Prisma), carte Leaflet cadrée sur le Bénin, statut fiscal (impôts à jour).
- Moteur de conformité : pièces manquantes, documents expirés, titulaires multiples, double vente, hypothèque, chevauchement géographique.
- Fac-similés de documents, **signature Ed25519** vérifiable publiquement (`/verification-signature`), journal d'audit chaîné et signé.
- Demandes d'achat (sans paiement) instruites par un agent : checklist obligatoire en 6 points, transfert de propriété transactionnel.
- Rendez-vous, notifications, espaces notaire/géomètre (dépôt de pièces signées), gestion du terrain par le propriétaire.
- Tableau de bord administrateur, exports CSV, panneau d'accessibilité (contraste, taille de texte, lecture vocale).
- Contrôles d'accès revérifiés côté serveur dans chaque action et route.

## Stockage des fichiers

Le modèle `Document` prévoit `fichierContenu` (bytea) et `empreinteFichier` pour l'import de scans ; en production,
remplacer par un stockage objet (Vercel Blob, S3) et ne garder que l'URL.
