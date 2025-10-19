/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ REMOVA estas linhas durante desenvolvimento local
  // basePath: '/wp-content/plugins/mag-seguro-militar-simulator/next-app',
  // assetPrefix: '/wp-content/plugins/mag-seguro-militar-simulator/next-app/',

  output: 'export',
  reactStrictMode: false,
  
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;