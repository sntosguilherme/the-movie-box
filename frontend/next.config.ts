import path from "node:path";
import type { NextConfig } from "next";

// A raiz do repositório permite importar o catálogo de ../backend no servidor.
const root = path.join(import.meta.dirname, "..");

const nextConfig: NextConfig = {
  turbopack: { root },
  outputFileTracingRoot: root,
  // Larguras do srcset alinhadas aos tamanhos que o CDN do TMDB já publica (ver PosterImage).
  images: {
    imageSizes: [92, 154, 185, 342],
    deviceSizes: [500, 780, 1280],
  },
};

export default nextConfig;
