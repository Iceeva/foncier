CREATE TYPE "Role" AS ENUM ('ACHETEUR', 'PROPRIETAIRE', 'AGENT', 'NOTAIRE', 'GEOMETRE', 'ADMIN');
CREATE TYPE "UsageParcelle" AS ENUM ('RESIDENTIEL', 'COMMERCIAL', 'AGRICOLE', 'TOURISTIQUE', 'INDUSTRIEL');
CREATE TYPE "StatutParcelle" AS ENUM ('EN_VENTE', 'HORS_VENTE', 'EN_COURS', 'LITIGE');
CREATE TYPE "TypeDocument" AS ENUM ('TF', 'PLAN', 'BORNAGE', 'CERT_APPARTENANCE', 'QUITUS', 'CONVENTION', 'ACTE_NOTARIE', 'HYPOTHEQUE');
CREATE TYPE "StatutDemande" AS ENUM ('EN_ATTENTE', 'VALIDEE', 'REJETEE', 'ANNULEE');
CREATE TYPE "MotifRdv" AS ENUM ('VISITE', 'VERIFICATION_GEOMETRE', 'SIGNATURE_NOTAIRE', 'REMISE_DOCUMENTS');
CREATE TYPE "StatutRdv" AS ENUM ('PROPOSE', 'CONFIRME', 'REFUSE', 'ANNULE', 'TERMINE');

CREATE TABLE "User" (
    "id" TEXT NOT NULL, "nom" TEXT NOT NULL, "email" TEXT NOT NULL, "telephone" TEXT,
    "motDePasseHash" TEXT NOT NULL, "role" "Role" NOT NULL, "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");

CREATE TABLE "Commune" (
    "id" TEXT NOT NULL, "nom" TEXT NOT NULL, "code" TEXT NOT NULL,
    "centreLat" DOUBLE PRECISION NOT NULL, "centreLng" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "Commune_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Commune_nom_key" ON "Commune"("nom");
CREATE UNIQUE INDEX "Commune_code_key" ON "Commune"("code");

CREATE TABLE "Parcelle" (
    "id" TEXT NOT NULL, "communeId" TEXT NOT NULL, "quartier" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL, "lng" DOUBLE PRECISION NOT NULL,
    "largeur" DOUBLE PRECISION NOT NULL, "longueur" DOUBLE PRECISION NOT NULL,
    "polygone" JSONB NOT NULL, "superficie" INTEGER NOT NULL, "usage" "UsageParcelle" NOT NULL,
    "statut" "StatutParcelle" NOT NULL DEFAULT 'HORS_VENTE', "prix" INTEGER, "description" TEXT,
    "proprietaireId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Parcelle_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Parcelle_communeId_idx" ON "Parcelle"("communeId");
CREATE INDEX "Parcelle_statut_idx" ON "Parcelle"("statut");
CREATE INDEX "Parcelle_usage_idx" ON "Parcelle"("usage");
CREATE INDEX "Parcelle_proprietaireId_idx" ON "Parcelle"("proprietaireId");
ALTER TABLE "Parcelle" ADD CONSTRAINT "Parcelle_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Parcelle" ADD CONSTRAINT "Parcelle_proprietaireId_fkey" FOREIGN KEY ("proprietaireId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "Document" (
    "id" TEXT NOT NULL, "parcelleId" TEXT NOT NULL, "type" "TypeDocument" NOT NULL, "numero" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL, "expire" TIMESTAMP(3), "statut" TEXT NOT NULL DEFAULT 'valide',
    "titulaireId" TEXT NOT NULL, "montant" INTEGER, "beneficiaireId" TEXT, "banque" TEXT,
    "fichierNom" TEXT, "fichierType" TEXT, "fichierTaille" INTEGER, "fichierContenu" BYTEA,
    "empreinteFichier" TEXT, "empreinteDonnees" TEXT NOT NULL, "signature" TEXT NOT NULL, "signePar" TEXT NOT NULL,
    "deposeParId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Document_numero_key" ON "Document"("numero");
CREATE INDEX "Document_parcelleId_idx" ON "Document"("parcelleId");
CREATE INDEX "Document_type_idx" ON "Document"("type");
CREATE INDEX "Document_titulaireId_idx" ON "Document"("titulaireId");
ALTER TABLE "Document" ADD CONSTRAINT "Document_parcelleId_fkey" FOREIGN KEY ("parcelleId") REFERENCES "Parcelle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_titulaireId_fkey" FOREIGN KEY ("titulaireId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_deposeParId_fkey" FOREIGN KEY ("deposeParId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "DemandeAchat" (
    "id" TEXT NOT NULL, "parcelleId" TEXT NOT NULL, "acheteurId" TEXT NOT NULL,
    "statut" "StatutDemande" NOT NULL DEFAULT 'EN_ATTENTE', "controle" JSONB NOT NULL DEFAULT '{}',
    "agentId" TEXT, "motifRejet" TEXT, "decisionLe" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DemandeAchat_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "DemandeAchat_parcelleId_idx" ON "DemandeAchat"("parcelleId");
CREATE INDEX "DemandeAchat_acheteurId_idx" ON "DemandeAchat"("acheteurId");
CREATE INDEX "DemandeAchat_statut_idx" ON "DemandeAchat"("statut");
ALTER TABLE "DemandeAchat" ADD CONSTRAINT "DemandeAchat_parcelleId_fkey" FOREIGN KEY ("parcelleId") REFERENCES "Parcelle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DemandeAchat" ADD CONSTRAINT "DemandeAchat_acheteurId_fkey" FOREIGN KEY ("acheteurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DemandeAchat" ADD CONSTRAINT "DemandeAchat_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "Rdv" (
    "id" TEXT NOT NULL, "parcelleId" TEXT NOT NULL, "motif" "MotifRdv" NOT NULL, "date" TIMESTAMP(3) NOT NULL,
    "lieu" TEXT NOT NULL, "statut" "StatutRdv" NOT NULL DEFAULT 'PROPOSE', "demandeurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rdv_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Rdv_parcelleId_idx" ON "Rdv"("parcelleId");
CREATE INDEX "Rdv_statut_idx" ON "Rdv"("statut");
ALTER TABLE "Rdv" ADD CONSTRAINT "Rdv_parcelleId_fkey" FOREIGN KEY ("parcelleId") REFERENCES "Parcelle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Rdv" ADD CONSTRAINT "Rdv_demandeurId_fkey" FOREIGN KEY ("demandeurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "RdvParticipant" (
    "id" TEXT NOT NULL, "rdvId" TEXT NOT NULL, "userId" TEXT NOT NULL,
    CONSTRAINT "RdvParticipant_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RdvParticipant_rdvId_userId_key" ON "RdvParticipant"("rdvId", "userId");
CREATE INDEX "RdvParticipant_userId_idx" ON "RdvParticipant"("userId");
ALTER TABLE "RdvParticipant" ADD CONSTRAINT "RdvParticipant_rdvId_fkey" FOREIGN KEY ("rdvId") REFERENCES "Rdv"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RdvParticipant" ADD CONSTRAINT "RdvParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "message" TEXT NOT NULL, "lien" TEXT NOT NULL,
    "lue" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Notification_userId_lue_idx" ON "Notification"("userId", "lue");
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL, "action" TEXT NOT NULL, "details" JSONB NOT NULL, "precedent" TEXT NOT NULL,
    "empreinte" TEXT NOT NULL, "signature" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AuditLog_empreinte_key" ON "AuditLog"("empreinte");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
