import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: process.cwd(),
  },
  agentRules: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "petsdaily.live" }],
        destination: "https://www.petsdaily.live/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
