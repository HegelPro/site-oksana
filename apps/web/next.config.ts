import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@oksana/catalog"],
  reactStrictMode: true,
};

export default nextConfig;
