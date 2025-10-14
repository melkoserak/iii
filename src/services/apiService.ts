// src/services/apiService.ts

// Define a "forma" de um objeto de profissão
export interface ProfessionOption {
  value: string; // Conterá o código CBO (ex: "010105")
  label: string; // Conterá a descrição (ex: "Oficiais generais da aeronáutica")
}

// URL base da sua API WordPress
const API_BASE_URL = "https://www.goldenbearseguros.com.br/wp-json/mag-simulator/v1";

export const getProfessions = async (): Promise<ProfessionOption[]> => {
  try {
    // Faz a chamada para a URL completa da API
    const response = await fetch(`${API_BASE_URL}/professions`);
    if (!response.ok) {
      throw new Error('Falha ao buscar profissões');
    }
    const data = await response.json();

    // Transforma os dados da API para o formato que nosso Autocomplete espera
    const formattedData = data.map((prof: any) => ({
      value: prof.Auxiliar,
      label: prof.Descricao,
    }));
    
    return formattedData;
  } catch (error) {
    console.error("Erro na API de profissões:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};

// Tipagem para os dados do formulário que vamos enviar
interface SimulationPayload {
  mag_nome_completo: string;
  mag_cpf: string;
  mag_data_nascimento: string;
  mag_sexo: string;
  mag_renda: string;
  mag_estado: string;
  mag_profissao_cbo: string;
}

export const getSimulation = async (formData: SimulationPayload) => {
  console.log("DEBUG [apiService]: A enviar os seguintes dados para a API:", formData);
  try {
    const response = await fetch('/api/simulation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any),
    });

    const data = await response.json();

    // --- CONSOLE LOG AQUI ---
    console.log("DEBUG [apiService]: Resposta CRUA recebida do servidor:", data);

    if (!response.ok) {
      console.error("DEBUG [apiService]: A resposta da API não foi OK (status não foi 2xx).", data);
      throw new Error(data.message || 'Falha ao buscar a simulação.');
    }

    return data;
  } catch (error) {
    console.error("DEBUG [apiService]: Ocorreu um erro na chamada fetch.", error);
    throw error;
  }
};