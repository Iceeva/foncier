# FoncierSûr Bénin — application React/Next.js

Plateforme de vérification et de sécurisation foncière — réécriture complète
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

1. Importer le dépôt — framework détecté automatiquement : **Next.js**.
2. Ajouter une base PostgreSQL (Vercel Postgres, Neon, Supabase…) et renseigner `DATABASE_URL`.
3. Renseigner `AUTH_SECRET` et les clés de signature (voir `.env.example`).
4. Le build exécute automatiquement `prisma generate` puis `next build`.
5. Exécuter `npx prisma migrate deploy` puis `npm run db:seed`.

## Journal de développement

| # | Étape |
|---|-------|
| 1 | Init Next.js (Vercel-ready) + schéma Prisma complet (hors paiement), migration validée sur PostgreSQL réel |
