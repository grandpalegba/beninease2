/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wtjhkqkqmexddroqwawk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://wtjhkqkqmexddroqwawk.supabase.co https://www.googletagmanager.com https://www.google-analytics.com https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: https://wtjhkqkqmexddroqwawk.supabase.co https://images.unsplash.com https://plus.unsplash.com https://img.youtube.com https://s.ytimg.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: wss: https://wtjhkqkqmexddroqwawk.supabase.co https://www.google-analytics.com; frame-src 'self' https://www.youtube.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

