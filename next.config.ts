import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages runs under the repository subdirectory: /RompeHielo_APP
  basePath: isProd ? "/RompeHielo_APP" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
