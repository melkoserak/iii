// src/services/apiService.ts

/**
 * Lê o nonce de segurança injetado pelo WordPress na janela do navegador.
 * Essencial para autenticar as requisições do frontend.
 */
const getNonce = (): string => {
  if (typeof window !== 'undefined' && (window as any).my_simulator_settings?.nonce) {
    return (window as any).my_simulator_settings.nonce;
  }
  console.warn("WP Nonce não encontrado. As requisições de API falharão em produção.");
  return ''; // Retorna vazio se não encontrar (falhará no servidor, o que é o esperado)
};

/**
 * Constrói a URL completa para um endpoint da API.
 * Em desenvolvimento, usa o proxy do Next.js. Em produção, usa a URL injetada pelo WordPress.
 */
const getRestUrl = (endpoint: string): string => {
  if (typeof window !== 'undefined' && (window as any).my_simulator_settings?.rest_url) {
    // Em produção (no WordPress)
    return (window as any).my_simulator_settings.rest_url + endpoint;
  }
  // Em desenvolvimento local (usando next.config.ts rewrites)
  return `/api/${endpoint}`;
};


// Tipagem para as opções de profissão
export interface ProfessionOption {
  value: string;
  label: string;
}

/**
 * Busca a lista de profissões do backend.
 */
export const getProfessions = async (): Promise<ProfessionOption[]> => {
  try {
    const response = await fetch(getRestUrl('professions'), {
      method: 'GET',
      headers: { 'X-WP-Nonce': getNonce() }
    });
    if (!response.ok) {
      throw new Error('Falha ao buscar profissões');
    }
    const data = await response.json();
    return data.map((prof: any) => ({
      value: prof.Auxiliar,
      label: prof.Descricao,
    }));
  } catch (error) {
    console.error("Erro na API de profissões:", error);
    return [];
  }
};

// Tipagem para os dados da simulação
interface SimulationPayload {
  mag_nome_completo: string;
  mag_cpf: string;
  mag_data_nascimento: string;
  mag_sexo: string;
  mag_renda: string;
  mag_estado: string;
  mag_profissao_cbo: string;
}

/**
 * Envia os dados do formulário para obter uma simulação.
 */
export const getSimulation = async (formData: SimulationPayload) => {
  try {
    const response = await fetch('/api/simulation', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-WP-Nonce': getNonce()
      },
      // A correção aqui é garantir que o tipo do body seja conhecido
        body: new URLSearchParams(formData as unknown as Record<string, string>),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Falha ao buscar a simulação.');
    }
    return data; 
  } catch (error) {
    console.error("DEBUG [apiService]: Erro na chamada da simulação.", error);
    throw error;
  }
};

// Tipagem para a resposta da API ViaCEP
export interface AddressData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

/**
 * Busca dados de endereço a partir de um CEP (API pública ViaCEP).
 */
export const getAddressByZipCode = async (zipCode: string): Promise<AddressData> => {
  const cleanedZip = zipCode.replace(/\D/g, '');
  if (cleanedZip.length !== 8) throw new Error('CEP deve conter 8 dígitos.');
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanedZip}/json/`);
    if (!response.ok) throw new Error('Não foi possível buscar o CEP.');
    const data = await response.json();
    if (data.erro) throw new Error('CEP não encontrado.');
    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
    };
  } catch (error) {
    console.error("Erro na API ViaCEP:", error);
    throw error;
  }
};

/**
 * Busca o token principal para os widgets.
 */
export const getWidgetToken = async (): Promise<{ token: string }> => {
  try {
    const response = await fetch(getRestUrl('widget/token'), { 
      method: 'POST',
      headers: { 'X-WP-Nonce': getNonce() }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao obter token do widget.');
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na API getWidgetToken:", error);
    throw error;
  }
};

/**
 * Reserva um número de proposta usando o token do widget.
 */
export const reserveProposalNumber = async (token: string): Promise<{ proposalNumber: string }> => {
  try {
     const response = await fetch(getRestUrl('proposal/reserve'), { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': getNonce()
      },
      body: JSON.stringify({ token })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao reservar número da proposta.');
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na API reserveProposalNumber:", error);
    throw error;
  }
};

/**
 * Busca o token específico para o widget de questionário.
 */
export const getQuestionnaireToken = async (): Promise<{ token: string }> => {
  try {
    const response = await fetch(getRestUrl('questionnaire/token'), { 
      method: 'POST',
      headers: { 'X-WP-Nonce': getNonce() }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao obter token do questionário.');
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na API getQuestionnaireToken:", error);
    throw error;
  }
};

/**
 * Busca o token específico para o widget de pagamento.
 */
export const getPaymentToken = async (): Promise<{ token: string }> => {
  try {
     const response = await fetch(getRestUrl('payment/token'), { 
      method: 'POST',
      headers: { 'X-WP-Nonce': getNonce() }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao obter token de pagamento.');
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na API getPaymentToken:", error);
    throw error;
  }
};