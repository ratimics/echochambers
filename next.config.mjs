/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true // For faster builds, remove if type checking is critical
  },
  // Use webpack config to disable HMR in production
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.hot = false;
    }
    // Optimize for faster builds
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
    return config;
  },
  
  // API rewrites
  output: 'standalone',
  async rewrites() {
    const roomsPort = 3001; // Assumed port for rooms API
    const pluginsPort = 3001; // Assumed port for plugins API (or adjust as needed)

    // Using 0.0.0.0 to make the server accessible externally.  Adjust if necessary.
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