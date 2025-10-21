/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
  },
  compiler: {
    removeConsole: true,
  },
};

module.exports = nextConfig;
