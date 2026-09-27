import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Casa de Bienes Comunales Copainalá",
  description: "Sistema de gestión de comuneros, parcelas, lotes y asambleas de Copainalá.",
  icons: {
    icon: "/recibo1.png",
    shortcut: "/recibo1.png",
    apple: "/recibo1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col overflow-hidden">{children}</body>
    </html>
  );
}