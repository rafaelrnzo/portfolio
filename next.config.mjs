/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dwuuwldcw/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
