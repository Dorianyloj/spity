import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spity - Communauté Escalade",
  description: "Réseau social dédié à la communauté d'escalade. Partagez vos sessions, découvrez de nouveaux spots et connectez avec d'autres grimpeurs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <a
          href="#contenu-principal"
          className="fixed left-4 top-0 z-[100] -translate-y-full rounded-md bg-primary px-4 py-3 font-bold text-primary-foreground shadow-lg transition-transform focus:top-4 focus:translate-y-0"
        >
          Aller au contenu principal
        </a>
        <div id="contenu-principal" tabIndex={-1}>
          {children}
        </div>
      </body>
    </html>
  );
}
