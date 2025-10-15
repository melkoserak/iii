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
  const products = apiData?.Valor?.simulacoes?.[0]?.produtos;
  if (!products) {
    console.error("Estrutura da API inesperada. 'products' não encontrado.");
    return { coverages: [], mainSusep: null };
  }

  const preferredProduct = products.find((p: any) => p.idProduto === 2096);
  const productsToProcess = preferredProduct ? [preferredProduct] : products;
  
  const mainSusep = productsToProcess[0]?.coberturas?.[0]?.numeroProcessoSusep || null;

  const allCoverages: Coverage[] = productsToProcess.flatMap(
    (product: any) =>
      product.coberturas.map((cov: any, index: number) => {
        const baseCapital = parseFloat(cov.capitalBase || 0);
        
        // --- INÍCIO DA ALTERAÇÃO PARA O MÍNIMO DE 20 MIL ---
        // 1. Define o mínimo da API ou o capital base.
        const apiMinCapital = parseFloat(cov.valorMinimoCapitalContratacao) || baseCapital || 0;
        
        // 2. Garante que o mínimo seja de pelo menos 20.000.
        const minCapital = Math.max(apiMinCapital, 20000);
        // --- FIM DA ALTERAÇÃO ---

        return {
          id: `${product.idProduto}-${cov.itemProdutoId || cov.id || cov.descricao}`,
          name: cov.descricao || "Cobertura sem nome",
          description: cov.descricaoDigitalCurta || "Descrição não fornecida.", 
          longDescription: cov.descricaoDigitalLonga || "Detalhes não fornecidos.",
          susep: cov.numeroProcessoSusep || 'N/A',
          isAdjustable: cov.tipoId === 3, 
          calculationType: cov.tipoId,
          isMandatory: cov.obrigatoria === true,
          
          // --- APLICA A ALTERAÇÃO AQUI ---
          minCapital: minCapital,

          maxCapital: parseFloat(cov.limite || 0),
          baseCapital: baseCapital,
          basePremium: parseFloat(cov.premioBase || 0),
          isActive: cov.obrigatoria === true || true,
          
          // Garante que o capital inicial também respeite o novo mínimo de 20.000.
          currentCapital: Math.max(baseCapital, minCapital),

          originalData: cov,
        };
      })
  );
  
  const uniqueCoverages = Array.from(new Map(allCoverages.map((c: Coverage) => [c.name, c])).values());
  console.log("DEBUG [useCoverageStore]: Dados normalizados:", { coverages: uniqueCoverages, mainSusep });
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