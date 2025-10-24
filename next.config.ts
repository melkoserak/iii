/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. INFORMA AO NEXT.JS QUE O SITE ESTARÁ EM /simulador
  basePath: '/simulador',
  assetPrefix: '/simulador',

  // 2. MANTÉM A EXPORTAÇÃO ESTÁTICA
  output: 'export',
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },

  // 3. REMOVEMOS O PROXY (rewrites). NÃO É MAIS NECESSÁRIO.
};

module.exports = nextConfig;