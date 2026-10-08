import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { preconnect } from "react-dom";
import Footer from "@/components/Footer";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "The Movie Box",
  description: "Pesquisa e navegação em um catálogo de filmes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  preconnect("https://image.tmdb.org");

  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} ${instrumentSerif.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
