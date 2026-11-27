import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: { "/*": ["./content/courses/*.md"] },
  transpilePackages: ["@oksana/catalog"],
  reactStrictMode: true,
};

export default nextConfig;
