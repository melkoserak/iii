// src/lib/tracking.ts

// Tipagem para os nossos eventos
type GTMEvent = {
  event: string;
  [key: string]: any;
};

declare global {
  interface Window {
    dataLayer: GTMEvent[];
  }
}

// Função base para enviar eventos (a que já tínhamos)
const event = (data: GTMEvent) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
};

// --- LÓGICA AVANÇADA ---

// Gera ou recupera um ID de utilizador anónimo para a sessão
const getAnonymousUserId = (): string => {
  let userId = sessionStorage.getItem('anonymous_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('anonymous_user_id', userId);
  }
  return userId;
};

// Nossa nova função de tracking principal
export const track = (eventName: string, data: Record<string, any>) => {
  event({
    event: eventName,
    // Adiciona dados contextuais a TODOS os eventos automaticamente
    user_properties: {
      anonymous_id: getAnonymousUserId(),
    },
    // Adiciona os dados específicos do evento
    ...data,
  });
};