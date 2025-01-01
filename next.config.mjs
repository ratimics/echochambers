/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use webpack config to disable HMR in production
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.hot = false;
    }
    return config;
  },
  
  // API rewrites
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