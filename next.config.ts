/** @type {import('next').NextConfig} */
const nextConfig = {
  // Adiciona a configuração de "rewrites" para atuar como proxy.
  // Isso redireciona as chamadas do frontend local para a API REST do seu site.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://www.goldenbearseguros.com.br/simulador_mag_militar/wp-json/:path*',
      },
    ];
  },

  // Necessário para poder gerar os arquivos estáticos para o seu servidor atual
  output: 'export',

  // Desativa o modo estrito do React para evitar renderizações duplicadas em desenvolvimento
  // (ajuda a evitar chamadas duplicadas à API durante os testes)
  reactStrictMode: false,
};

module.exports = nextConfig;