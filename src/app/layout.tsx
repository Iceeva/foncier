import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const atkinson = localFont({
  src: [
    { path: "./fonts/AtkinsonHyperlegible-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/AtkinsonHyperlegible-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/AtkinsonHyperlegible-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/AtkinsonHyperlegible-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-atkinson", display: "swap",
});

export const metadata: Metadata = {
  title: { default: "FoncierSûr Bénin", template: "%s - FoncierSûr Bénin" },
  description: "Visualiser, vérifier et sécuriser l'information foncière au Bénin (plateforme de démonstration).",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0f5c46" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={atkinson.variable}>
      <body>
        <a className="lien-evitement" href="#contenu">Aller au contenu</a>
        {children}
        <div id="annonces" className="sr-only" aria-live="polite" />
      </body>
    </html>
  );
}
