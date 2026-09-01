import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://thevelvetdesk.github.io/market-this-morning/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
