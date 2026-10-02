import type { NextConfig } from "next";

// Site estático: `next build` gera `out/`, publicável em qualquer hospedagem.
const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default config;
