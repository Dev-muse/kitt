import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [{ hostname: "covers.openlibrary.org",  protocol: "https" },
      { hostname: "y8a8rempvyhx9jtf.public.blob.vercel-storage.com",protocol: "https" }
    ],
  },
};

export default nextConfig;
