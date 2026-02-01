import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lokia - Assistant IA pour PME",
  description: "Votre IA d'entreprise - locale ou cloud, toujours confidentielle, toujours professionnelle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
