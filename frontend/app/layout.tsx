import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3001"),
  title: {
    default: "VivaLista",
    template: "%s | VivaLista",
  },
  description:
    "VivaLista é uma plataforma para criar páginas de eventos, listas de presentes, confirmações de presença e experiências públicas personalizadas.",
  applicationName: "VivaLista",
  keywords: [
    "VivaLista",
    "lista de presentes",
    "casamento",
    "chá de cozinha",
    "chá de bebê",
    "eventos",
    "RSVP",
    "convite digital",
  ],
  authors: [{ name: "VivaLista" }],
  creator: "VivaLista",
  publisher: "VivaLista",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "VivaLista",
    description:
      "Crie páginas de eventos, listas de presentes e experiências públicas personalizadas com o VivaLista.",
    siteName: "VivaLista",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VivaLista",
    description:
      "Crie páginas de eventos, listas de presentes e experiências públicas personalizadas com o VivaLista.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-neutral-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}