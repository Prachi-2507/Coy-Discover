/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '172.*.*.*'],
  async rewrites() {
    return [
      { source: '/feed', destination: '/api/feed' },
      { source: '/swipe', destination: '/api/swipe' },
      { source: '/matches', destination: '/api/matches' },
    ];
  },
};

export default nextConfig;