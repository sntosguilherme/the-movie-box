import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catálogo de Filmes — ED II",
  description: "Pesquisa e navegação em um catálogo de filmes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
