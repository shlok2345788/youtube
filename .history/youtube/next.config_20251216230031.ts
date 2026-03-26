import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env :{
    BACKEND_URL : process.env.NEXT
  }
};

export default nextConfig;
