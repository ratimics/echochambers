
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.cache = true;
      config.optimization = {
        ...config.optimization,
        minimize: true,
        moduleIds: 'deterministic',
        runtimeChunk: { name: 'runtime' },
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    return config;
  },
  
  output: 'standalone',
  async rewrites() {
    const roomsPort = 3001;
    const pluginsPort = 3001;
    const serverAddress = process.env.NODE_ENV === 'development' ? '0.0.0.0' : 'localhost';

    return process.env.NODE_ENV === 'development' 
      ? [
          {
            source: '/api/rooms/:path*',
            destination: `http://${serverAddress}:${roomsPort}/api/rooms/:path*`
          },
          {
            source: '/api/plugins/:path*',
            destination: `http://${serverAddress}:${pluginsPort}/api/plugins/:path*`
          }
        ]
      : [];
  }
}

export default nextConfig;
