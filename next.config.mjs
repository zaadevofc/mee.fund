import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  register: true,
  disable: process.env.NODE_ENV === "development",
  sw: "service-worker.js",
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: true,
  },
  images: {
    formats: ["image/avif"],
    minimumCacheTTL: 999999,
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "cdn.discordapp.com" },
      { hostname: "ucarecdn.com" },
    ],
  },
};

export default withPWA(nextConfig);
