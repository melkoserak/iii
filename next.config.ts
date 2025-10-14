// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  // A configuração de "rewrites" pode ser removida ou mantida
  // apenas para facilitar o desenvolvimento local.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://www.goldenbearseguros.com.br/wp-json/mag-simulator/v1/:path*',
      },
    ];
  },

  // Esta é a linha mais importante para o seu caso!
  output: 'export',
  
  // Manter reactStrictMode como false se necessário
  reactStrictMode: false,
};

module.exports = nextConfig;