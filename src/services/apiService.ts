// src/services/apiService.ts

// Detecta ambiente automaticamente
const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// URL base do proxy
const API_BASE_URL = isDevelopment
  ? 'https://www.goldenbearseguros.com.br/api-proxy-secure.php' // Mesmo em dev, usa produção
  : 'https://www.goldenbearseguros.com.br/api-proxy-secure.php';

// Helper para construir URLs do proxy
const getProxyUrl = (endpoint: string): string => {
  return `${API_BASE_URL}?endpoint=${endpoint}`;
};

// Log apenas em desenvolvimento
const devLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log('[API DEV]', ...args);
  }
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
    const response = await fetch(getProxyUrl('professions'), {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao buscar profissões');
    }
    
    const data: { Auxiliar: string; Descricao: string }[] = await response.json();
    return data.map((prof) => ({
      value: prof.Auxiliar,
      label: prof.Descricao,
    }));
  } catch (error) {
    console.error("Erro na API de profissões:", error);
    throw error;
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
    const response = await fetch(getProxyUrl('simulation'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao buscar a simulação.');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erro na chamada da simulação:", error);
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
    const response = await fetch(getProxyUrl('widget-token'), {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao obter token do widget.');
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
    const response = await fetch(getProxyUrl('proposal-reserve'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ token }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao reservar número da proposta.');
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
    const response = await fetch(getProxyUrl('questionnaire-token'), {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao obter token do questionário.');
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
    const response = await fetch(getProxyUrl('payment-token'), {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao obter token de pagamento.');
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
type ProposalPayload = Record<string, any>;

/**
 * Envia a proposta final para o backend.
 */
export const submitProposal = async (payload: ProposalPayload) => {
  try {
    const response = await fetch(getProxyUrl('proposal'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao enviar a proposta.');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erro na submissão da proposta:", error);
    throw error;
  }
};