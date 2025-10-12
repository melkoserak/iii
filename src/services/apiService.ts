// Define a "forma" de um objeto de profissão
export interface ProfessionOption {
  value: string; // Conterá o código CBO (ex: "010105")
  label: string; // Conterá a descrição (ex: "Oficiais generais da aeronáutica")
}

export const getProfessions = async (): Promise<ProfessionOption[]> => {
  try {
    // Usamos o rewrite do Next.js que configuramos
    const response = await fetch('/api/professions');
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