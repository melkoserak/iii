// src/stores/useSimulatorStore.ts
import { create } from 'zustand';

// Tipos (deixe como estão)
type ValidationStatus = { fullNameError: string | null; cpfError: string | null; emailError: string | null; phoneError: string | null; stateError: string | null; birthDateError: string | null; genderError: string | null; incomeError: string | null; professionError: string | null; };
type FormData = { fullName: string; cpf: string; email: string; phone: string; state: string; consent: boolean; birthDate: string; gender: string; income: string; profession: string; };

type SimulatorState = {
  currentStep: number;
  formData: FormData;
  validationStatus: ValidationStatus;
  actions: {
    nextStep: () => void;
    prevStep: () => void;
    setFormData: (data: Partial<FormData>) => void;
    setValidationStatus: (status: Partial<ValidationStatus>) => void;
    reset: () => void;
    hydrateFromStorage: () => void; // <-- 1. Adicionamos a nova ação à tipagem
  }
};

const initialState = {
  currentStep: 1,
  formData: { fullName: "", cpf: "", email: "", phone: "", state: "", consent: false, birthDate: "", gender: "", income: "", profession: "", },
  validationStatus: { fullNameError: null, cpfError: null, emailError: null, phoneError: null, stateError: null, birthDateError: null, genderError: null, incomeError: null, professionError: null, },
};

const STORAGE_KEY = 'simulator-form-data'; // Chave para o localStorage

export const useSimulatorStore = create<SimulatorState>((set) => ({
  ...initialState,
  actions: {
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    
    // 2. Atualizamos a função setFormData para guardar os dados
    setFormData: (data) => set((state) => {
      const newFormData = { ...state.formData, ...data };
      // Verificamos se estamos no browser antes de usar o localStorage
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
      set(initialState);
    },

    // 3. Adicionamos a implementação da nova ação para carregar os dados
    hydrateFromStorage: () => {
      if (typeof window === 'undefined') return;
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          set({ formData: JSON.parse(savedData) });
        }
      } catch (error) {
        console.error("Falha ao carregar dados do localStorage", error);
      }
    },
  }
}));