import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Surface lint issues at build time.
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Update images are served straight from Sanity's CDN via the custom loader
    // in lib/sanity-image.ts, which keeps them off Netlify's Image CDN (and off
    // the Netlify credit budget). Local images are unaffected.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
