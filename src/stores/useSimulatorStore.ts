import { create } from 'zustand';

// Define a "forma" dos dados do nosso formulário
type FormData = {
  fullName: string;
  // --- CAMPOS ADICIONADOS ---
  cpf: string;
  email: string;
  phone: string;
  state: string; // Para o UF (ex: 'SP')
  consent: boolean;
  // --- FIM DA ADIÇÃO ---
};

// Define a "forma" completa da nossa store: o estado e as ações
type SimulatorState = {
  currentStep: number;
  formData: FormData;
  actions: {
    nextStep: () => void;
    prevStep: () => void;
    setFormData: (data: Partial<FormData>) => void;
    goToStep: (step: number) => void;
    reset: () => void;
  }
};

const initialState = {
  currentStep: 1,
  formData: {
    fullName: "",
    // --- VALORES INICIAIS ADICIONADOS ---
    cpf: "",
    email: "",
    phone: "",
    state: "",
    consent: false,
    // --- FIM DA ADIÇÃO ---
  },
};

// Cria a store com o Zustand
export const useSimulatorStore = create<SimulatorState>((set) => ({
  ...initialState,
  actions: {
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    goToStep: (step) => set({ currentStep: step }),
    setFormData: (data) => set((state) => ({ 
      formData: { ...state.formData, ...data } 
    })),
    reset: () => set(initialState),
  }
}));