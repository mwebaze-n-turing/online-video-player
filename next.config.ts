// next.config.js
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Handle media worker files correctly
  webpack: (config, { isServer }) => {
    // Configure worker loading for HLS.js and other libraries
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      options: {
        filename: 'static/chunks/[name].[contenthash].js',
        publicPath: '/_next/',
      },
    });

    // Handle WebAssembly for ffmpeg and other libraries
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Optimize chunk size for video libraries
    config.optimization.splitChunks.cacheGroups = {
      ...config.optimization.splitChunks.cacheGroups,
      videoVendors: {
        test: /[\\/]node_modules[\\/](video\.js|hls\.js|dashjs|plyr|shaka-player|@mux|@ffmpeg)[\\/]/,
        name: 'video-vendors',
        priority: 10,
        chunks: 'all',
      },
    };

    // Fix potential issues with module resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    return config;
  },

  // Handle media files
  images: {
    domains: ['example.com', 'your-video-cdn.com', 'images.unsplash.com'],
  },

  // Properly handle media files in the build
  output: 'standalone',
};

module.exports = nextConfig;
