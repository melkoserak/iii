/** @type {import('next').NextConfig} */
const nextConfig = {
  // Adiciona a configuração de "rewrites" para atuar como proxy.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // --- CORREÇÃO APLICADA AQUI ---
        // Adicionado o caminho correto para a sua API customizada
        destination: 'https://www.goldenbearseguros.com.br/wp-json/mag-simulator/v1/:path*',
      },
    ];
  },

  // ... (o resto da sua configuração continua a mesma)
  output: 'export',
  reactStrictMode: false,
};

module.exports = nextConfig;