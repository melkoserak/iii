/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ INFORMA AO NEXT.JS ONDE OS ARQUIVOS ESTARÃO NO SERVIDOR
  assetPrefix: '/wp-content/plugins/mag-seguro-militar-simulator/next-app/',

  // Garante que os caminhos de imagem também usem o assetPrefix
  images: {
    unoptimized: true,
  },

  output: 'export',

  reactStrictMode: false,
};

module.exports = nextConfig;