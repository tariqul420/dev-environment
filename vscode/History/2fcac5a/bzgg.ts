import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typedRouts: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
