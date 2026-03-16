import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@heroicons/react"],
    useCache: true,
  },
};

export default nextConfig;
