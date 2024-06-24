/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif"],
    minimumCacheTTL: 999999,
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  }
};

export default nextConfig;
