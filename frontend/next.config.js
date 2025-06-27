const webpack = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      process: require.resolve("process/browser"),
      fs: false,
      net: false,
      tls: false,
    };

    config.plugins.push(
      new webpack.ProvidePlugin({
        process: "process/browser",
      })
    );

    return config;
  },
};

module.exports = nextConfig;
