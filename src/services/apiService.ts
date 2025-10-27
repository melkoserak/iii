// src/services/apiService.ts
import { useSimulatorStore } from '@/stores/useSimulatorStore';

// URL base da API REST do WordPress (SEU SITE ONLINE)
const WP_API_BASE_URL = 'https://www.goldenbearseguros.com.br/wp-json/mag-simulator/v1';
const API_BASE_URL = WP_API_BASE_URL;

const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// --- INÍCIO DA ADIÇÃO ---
// Tipagem para as opções de profissão (precisa estar definida aqui também)
export interface ProfessionOption {
  value: string;
  label: string;
}

/**
 * Busca a lista de profissões do backend.
 */
export const getProfessions = async (): Promise<ProfessionOption[]> => {
  try {
    const nonce = useSimulatorStore.getState().wpNonce;
    if (!nonce) {
       console.error("Nonce não está disponível para getProfessions.");
       // throw new Error("WordPress Nonce não encontrado.");
    }
    console.log(`Usando Nonce para getProfessions: ${nonce}`);

    const response = await fetch(getApiUrl('professions'), { // <-- getApiUrl
      method: 'GET',
      headers: {
        ...(nonce && { 'X-WP-Nonce': nonce }),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Falha ao buscar profissões e decodificar erro.' })); // Tratamento de erro aprimorado
      throw new Error(error.error || `Falha ao buscar profissões (${response.statusText})`);
    }

    const data: { Auxiliar: string; Descricao: string }[] = await response.json();
    // A conversão para ProfessionOption está correta
    return data.map((prof) => ({
      value: prof.Auxiliar,
      label: prof.Descricao,
    }));

  } catch (error) {
     console.error("Erro na API de profissões:", error);
     throw error; // Re-lança o erro para ser tratado onde a função for chamada
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
    const response = await fetch(getApiUrl('simulation'), {
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
    const response = await fetch(getApiUrl('widget/token'), {
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
    const response = await fetch(getApiUrl('proposal/reserve'), {
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
    const response = await fetch(getApiUrl('questionnaire/token'), {
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
    const response = await fetch(getApiUrl('payment/token'), {
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
type ProposalPayload = Record<string, unknown>;

/**
 * Envia a proposta final para o backend.
 */
export const submitProposal = async (payload: ProposalPayload) => {
  try {
    const response = await fetch(getApiUrl('proposal'), {
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