import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack disabled to avoid build error with workUnitAsyncStorage
  // experimental: {
  //   turbopackFileSystemCacheForDev: true,
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
