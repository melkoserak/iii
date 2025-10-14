// src/lib/gtm.ts

// Tipagem para os nossos eventos
type GTMEvent = {
  event: string;
  [key: string]: any; // Permite outras propriedades como 'step', 'step_name'
};

// Declara a `dataLayer` no objeto window para o TypeScript não reclamar
declare global {
  interface Window {
    dataLayer: GTMEvent[];
  }
}

// Função reutilizável para disparar eventos
export const event = (data: GTMEvent) => {
  // Garante que o dataLayer existe
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
};