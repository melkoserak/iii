// src/stores/useCoverageStore.ts
import { create } from 'zustand';

export interface Coverage {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  susep: string;
  isMandatory: boolean;
  isAdjustable: boolean;
  minCapital: number;
  maxCapital: number;
  baseCapital: number;
  basePremium: number;
  calculationType: number;
  originalData: any;
  isActive: boolean;
  currentCapital: number;
}

type CoverageState = {
  coverages: Coverage[];
  mainSusep: string | null;
  setInitialCoverages: (apiData: any) => void;
  toggleCoverage: (id: string) => void;
  updateCapital: (id: string, capital: number) => void;
  getCalculatedPremium: (coverage: Coverage) => number;
  getTotalPremium: () => number;
  getTotalIndemnity: () => number;
};

const normalizeApiData = (apiData: any): { coverages: Coverage[], mainSusep: string | null } => {
  const products = apiData?.api_response?.Valor?.simulacoes?.[0]?.produtos;
  if (!products) {
    return { coverages: [], mainSusep: null };
  }

  const preferredProduct = products.find((p: any) => p.idProduto === 2096);
  const productsToProcess = preferredProduct ? [preferredProduct] : products;
  
  // O log prova que o SUSEP não está a chegar, então mainSusep será null, o que está correto.
  const mainSusep = productsToProcess[0]?.coberturas?.[0]?.numeroProcessoSusep || null;

  const allCoverages: Coverage[] = productsToProcess.flatMap(
    (product: any) =>
      product.coberturas.map((cov: any, index: number) => {
        // --- CORREÇÕES FINAIS BASEADAS NOS SEUS LOGS ---
        return {
          id: `${product.idProduto}-${cov.itemProdutoId || cov.descricao || index}`,
          name: cov.descricao || "Cobertura sem nome",
          
          // Fallback: Como 'descricaoDigitalCurta' não vem, usamos a 'descricao' principal como um placeholder.
          description: cov.descricaoDigitalCurta || cov.descricao || "Descrição não fornecida.", 
          longDescription: cov.descricaoDigitalLonga || "Detalhes não fornecidos pela API.",
          susep: cov.numeroProcessoSusep || 'N/A',
          
          // O log prova que 'tipoId' existe diretamente no objeto 'cov'.
          isAdjustable: cov.tipoId === 3, 
          calculationType: cov.tipoId,
          // --- FIM DAS CORREÇÕES ---
          
          isMandatory: cov.obrigatoria === true,
          minCapital: parseFloat(cov.valorMinimoCapitalContratacao || 0),
          maxCapital: parseFloat(cov.limite || 0),
          baseCapital: parseFloat(cov.capitalBase || 0),
          basePremium: parseFloat(cov.premioBase || 0),
          isActive: cov.obrigatoria === true || true,
          currentCapital: parseFloat(cov.capitalBase || 0),
          originalData: cov,
        };
      })
  );
  
  const uniqueCoverages = Array.from(new Map(allCoverages.map((c: Coverage) => [c.name, c])).values());
  return { coverages: uniqueCoverages, mainSusep };
};

export const useCoverageStore = create<CoverageState>((set, get) => ({
  coverages: [],
  mainSusep: null,
  setInitialCoverages: (apiData) => {
    const { coverages, mainSusep } = normalizeApiData(apiData);
    set({ coverages, mainSusep });
  },
  toggleCoverage: (id) => set((state) => ({ coverages: state.coverages.map((c) => c.id === id && !c.isMandatory ? { ...c, isActive: !c.isActive } : c) })),
  updateCapital: (id, capital) => set((state) => ({ coverages: state.coverages.map((c) => c.id === id ? { ...c, currentCapital: capital } : c) })),
  getCalculatedPremium: (coverage) => {
    if (!coverage.isActive) return 0;
    const custoFixo = parseFloat(coverage.originalData?.custoFixo || 0);
    if (coverage.calculationType === 3 && coverage.baseCapital > 0) {
      return custoFixo + (coverage.currentCapital / coverage.baseCapital) * coverage.basePremium;
    }
    return custoFixo + coverage.basePremium;
  },
  getTotalPremium: () => {
    const { coverages, getCalculatedPremium } = get();
    return coverages.reduce((total, cov) => total + getCalculatedPremium(cov), 0);
  },
  getTotalIndemnity: () => {
    const { coverages } = get();
    return coverages.reduce((total, cov) => (cov.isActive ? total + cov.currentCapital : total), 0);
  },
}));