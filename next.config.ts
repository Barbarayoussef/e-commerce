import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "collection.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000", // 👈 your backend port
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000", // 👈 add this for old uploads
      },
    ],
  },
};

export default nextConfig;
