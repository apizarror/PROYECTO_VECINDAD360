import type { NextConfig } from "next";

const basePath = '/vecindad360';

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  allowedDevOrigins: [
    'dirsapol-aplicaciones.tailc6dcae.ts.net',
    '*.tailc6dcae.ts.net',
  ],
};

export default nextConfig;
