import path from "node:path";
import type { NextConfig } from "next";

// A raiz do repositório permite importar o catálogo de ../backend no servidor.
const root = path.join(import.meta.dirname, "..");

const nextConfig: NextConfig = {
  turbopack: { root },
  outputFileTracingRoot: root,
};

export default nextConfig;
