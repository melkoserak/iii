// src/stores/useSimulatorStore.ts
import { create } from 'zustand';


// 1. CRIADA UMA TIPAGEM PARA O RESPONSÁVEL LEGAL (CAMPOS SIMILARES)
type LegalRepresentative = {
  fullName: string;
  rg: string;
  cpf: string;
  birthDate: string;
  relationship: string;
};

// Tipagem para um Beneficiário (sem alterações)
export type Beneficiary = {
  id: string;
  fullName: string;
  rg: string;
  cpf: string;
  birthDate: string;
  relationship: string;
  legalRepresentative?: Partial<LegalRepresentative>;
};

// Tipagens de Erro e FormData (sem alterações)
type ValidationStatus = {
  fullNameError: string | null;
  cpfError: string | null;
  emailError: string | null;
  phoneError: string | null;
  stateError: string | null;
  birthDateError: string | null;
  genderError: string | null;
  incomeError: string | null;
  professionError: string | null;
  zipCodeError: string | null;
  streetError: string | null;
  numberError: string | null;
  neighborhoodError: string | null;
  cityError: string | null;
  maritalStatusError: string | null;
  rgNumberError: string | null;
  rgIssuerError: string | null;
  rgDateError: string | null;
  childrenCountError: string | null;
  companyError: string | null;
  isPPEError: string | null;
  beneficiariesError: string | null;
  paymentMethodError: string | null;      // <-- NOVO
};

type FormData = {
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  state: string;
  consent: boolean;
  birthDate: string;
  gender: string;
  income: string;
  profession: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  maritalStatus: string;
  homePhone: string;
  rgNumber: string;
  rgIssuer: string;
  rgDate: string;
  childrenCount: string;
  company: string;
  isPPE: string;
  beneficiaries: Beneficiary[];
 dpsAnswers?: Record<string, unknown>; // Substitui 'any' por um tipo mais seguro
  reservedProposalNumber?: string;
  paymentMethod: 'credit' | 'debit' | '';
  paymentPreAuthCode?: string;
};

type UpdateBeneficiaryData = Partial<Omit<Beneficiary, 'id' | 'legalRepresentative'>> & {
  legalRepresentative?: Partial<LegalRepresentative>;
};

type SimulatorState = {
  currentStep: number;
  formData: FormData;
  validationStatus: ValidationStatus;
  wpNonce: string | null; // <-- NOVO CAMPO PARA O NONCE
 actions: {
    nextStep: () => void;
    prevStep: () => void;
    setFormData: (data: Partial<FormData>) => void;
    setValidationStatus: (status: Partial<ValidationStatus>) => void; // Certifique-se que está aqui
    reset: () => void; // Certifique-se que está aqui
    hydrateFromStorage: () => void; // Certifique-se que está aqui
    addBeneficiary: () => void; // Certifique-se que está aqui
    removeBeneficiary: (id: string) => void; // Certifique-se que está aqui
    updateBeneficiary: (id: string, data: UpdateBeneficiaryData) => void; // Certifique-se que está aqui
    resetDpsAnswers: () => void; // Certifique-se que está aqui
    setWpNonce: (nonce: string | null) => void;
    fetchWpNonce: () => Promise<void>;
  }
};

// --- INÍCIO DA CORREÇÃO ---
const initialState: Omit<SimulatorState, 'actions'> = {
  wpNonce: null,
  currentStep: 1,
  formData: {
    fullName: "", cpf: "", email: "", phone: "", state: "", consent: false,
    birthDate: "", gender: "", income: "", profession: "",
    zipCode: "", street: "", number: "", complement: "", neighborhood: "",
    city: "", maritalStatus: "", homePhone: "", rgNumber: "", rgIssuer: "",
    rgDate: "", childrenCount: "0", company: "", isPPE: "",
    paymentMethod: '',
    paymentPreAuthCode: undefined,
    dpsAnswers: undefined,
    reservedProposalNumber: undefined,
    beneficiaries: [{
      id: Date.now().toString(),
      fullName: '', rg: '', cpf: '', birthDate: '', relationship: '',
      legalRepresentative: { fullName: '', rg: '', cpf: '', birthDate: '', relationship: '' }
    }],
  },
  validationStatus: {
    fullNameError: null, cpfError: null, emailError: null, phoneError: null,
    stateError: null, birthDateError: null, genderError: null, incomeError: null,
    professionError: null, zipCodeError: null, streetError: null, numberError: null,
    neighborhoodError: null, cityError: null, maritalStatusError: null,
    rgNumberError: null, rgIssuerError: null, rgDateError: null,
    childrenCountError: null, companyError: null, isPPEError: null,
    beneficiariesError: null, paymentMethodError: null,
  },
};
// --- FIM DA CORREÇÃO ---

const STORAGE_KEY = 'simulator-form-data';

// URL base da API REST do WordPress (SEU SITE ONLINE)
const WP_API_BASE_URL = 'https://www.goldenbearseguros.com.br/wp-json/mag-simulator/v1';

// A URL base agora é sempre a de produção
const API_BASE_URL = WP_API_BASE_URL;

// A função getApiUrl agora sempre constrói a URL direta
const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
// --- FIM DA CORREÇÃO DE ESCOPO ---

export const useSimulatorStore = create<SimulatorState>((set, get) => ({ // <-- 'get' é passado aqui
  ...initialState,
  actions: {
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),

    setFormData: (data) => set((state) => {
      const newFormData = { ...state.formData, ...data };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
      }
      return { formData: newFormData };
    }),
    
    setValidationStatus: (status) => set((state) => ({ validationStatus: { ...state.validationStatus, ...status } })),
    
    reset: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      set({ ...initialState, actions: get().actions }); // Reset state, keep actions
    },

    hydrateFromStorage: () => {
      if (typeof window === 'undefined') return;
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          set((state) => ({ formData: { ...state.formData, ...JSON.parse(savedData) } }));
        }
      } catch (error) {
        console.error("Falha ao carregar dados do localStorage", error);
      }
    },

    addBeneficiary: () => set((state) => {
      const newBeneficiary: Beneficiary = { 
        id: Date.now().toString(), 
        fullName: '', rg: '', cpf: '', birthDate: '', relationship: '',
        legalRepresentative: { fullName: '', rg: '', cpf: '', birthDate: '', relationship: '' }
      };
      const newFormData = { ...state.formData, beneficiaries: [...state.formData.beneficiaries, newBeneficiary] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
      return { formData: newFormData };
    }),

    removeBeneficiary: (id) => set((state) => {
      const newBeneficiaries = state.formData.beneficiaries.filter(b => b.id !== id);
      const newFormData = { ...state.formData, beneficiaries: newBeneficiaries };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
      return { formData: newFormData };
    }),
    
    updateBeneficiary: (id, data) => set((state) => {
      const newBeneficiaries = state.formData.beneficiaries.map(b => {
        if (b.id === id) {
          const updatedBeneficiary = { ...b, ...data };
          if (data.legalRepresentative) {
            updatedBeneficiary.legalRepresentative = {
              ...(b.legalRepresentative as LegalRepresentative),
              ...data.legalRepresentative
            };
          }
          return updatedBeneficiary;
        }
        return b;
      });
      const newFormData = { ...state.formData, beneficiaries: newBeneficiaries };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
      return { formData: newFormData };
    }),


    resetDpsAnswers: () => set((state) => {
      const newFormData = { ...state.formData, dpsAnswers: undefined };
      // Atualiza também o localStorage para remover as respostas salvas
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
      }
      return { formData: newFormData };
    }),

// Ações novas (nonce)
    setWpNonce: (nonce) => set({ wpNonce: nonce }),

    fetchWpNonce: async () => {
      // Usa 'get()' que é passado como argumento para 'create'
      if (get().wpNonce || typeof window === 'undefined') { // <-- Usa get() aqui
        console.log("Nonce já existe ou estamos no servidor, não buscando.");
        return;
      }
      try {
        console.log("Buscando Nonce do WordPress...");
        const nonceUrl = getApiUrl('nonce');
        console.log("URL do Nonce:", nonceUrl);
        const response = await fetch(nonceUrl, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Falha ao buscar nonce: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.nonce) {
          console.log("Nonce recebido:", data.nonce);
          set({ wpNonce: data.nonce });
        } else {
          throw new Error('Resposta da API de Nonce não continha um nonce.');
        }
      } catch (error) {
        console.error("Erro ao buscar Nonce do WordPress:", error);
        set({ wpNonce: null });
      }
    },
    // --- FIM DE TODAS AS AÇÕES ---
  }
}));
  