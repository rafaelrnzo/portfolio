import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

let supabaseHostname = "";

try {
  if (supabaseUrl) {
    const url = new URL(supabaseUrl);
    supabaseHostname = url.hostname;
  }
} catch (error) {
  console.warn("Warning: Invalid NEXT_PUBLIC_SUPABASE_URL in .env");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;