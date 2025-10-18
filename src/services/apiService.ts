// src/services/apiService.ts

// Define a type for the window object injected by WordPress
interface MyWindow extends Window {
  mag_settings?: {
    nonce: string;
    rest_url: string;
  };
}

const getNonce = (): string => {
  const settings = (window as MyWindow).mag_settings;
  if (typeof window !== 'undefined' && settings?.nonce) {
    return settings.nonce;
  }
  console.warn("WP Nonce não encontrado. As requisições de API falharão em produção.");
  return '';
};

const getRestUrl = (endpoint: string): string => {
  const settings = (window as MyWindow).mag_settings;
  // Esta verificação garante que SEMPRE usemos a URL do WordPress quando disponível
  if (typeof window !== 'undefined' && settings?.rest_url) {
    // A URL da API já vem completa do WordPress
    return settings.rest_url + endpoint;
  }

  // O fallback agora aponta para a estrutura correta do WordPress em desenvolvimento
  // (ajuste se a sua estrutura local for diferente)
  console.warn("WP REST URL não encontrada. Usando fallback para /wp-json/.");
  return `/wp-json/mag-simulator/v1/${endpoint}`;
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
    const data: { Auxiliar: string; Descricao: string }[] = await response.json();
    return data.map((prof) => ({
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

/**
 * Payload para submissão da proposta.
 */
type ProposalPayload = Record<string, string>;

/**
 * Envia a proposta final para o backend.
 */
export const submitProposal = async (payload: ProposalPayload) => {
  try {
    const response = await fetch(getRestUrl('proposal'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-WP-Nonce': getNonce()
      },
      body: new URLSearchParams(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Falha ao enviar a proposta.');
    }
    return data;
  } catch (error) {
    console.error("DEBUG [apiService]: Erro na submissão da proposta.", error);
    throw error;
  }
};