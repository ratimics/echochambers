
import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://0.0.0.0:3001/api/:path*',
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://0.0.0.0:3001/api/:path*`
      }
    ];
  }
};

export default nextConfig;
