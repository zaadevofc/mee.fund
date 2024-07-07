import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  register: true,
  disable: process.env.NODE_ENV === 'development',
  sw: 'service-worker.js',
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
  },
  fallbacks: {
    document: '/~offline',
    image: '/assets/defaults/thumbnails/offline.jpg',
    video: '/assets/defaults/thumbnails/offline.mp4',
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    localeDetection: false,
    locales: ['id'],
    defaultLocale: 'id',
  },
  experimental: {
    scrollRestoration: true,
    swcMinify: true,
  },
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 999999,
    remotePatterns: [
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'cdn.discordapp.com' },
      { hostname: 'ucarecdn.com' },
      { hostname: 'pchzoarnvyxkimkkfxcc.supabase.co' },
      { hostname: 'yrmnzileroexrdtkcyvd.supabase.co' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://mee.fund',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
