import { create } from 'zustand';

// A "forma" do nosso objeto de validação agora guarda mensagens de erro
type ValidationStatus = {
  fullNameError: string | null;
  cpfError: string | null;
  emailError: string | null;
  phoneError: string | null;
  stateError: string | null;
  // --- CAMPOS ADICIONADOS ---
  birthDateError: string | null;
  genderError: string | null;
  incomeError: string | null;
  professionError: string | null;
};

type FormData = {
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  state: string;
  consent: boolean;
   // --- CAMPOS ADICIONADOS ---
  birthDate: string;
  gender: string;
  income: string;
  profession: string; // Armazenará o CBO da profissão
};

type SimulatorState = {
  currentStep: number;
  formData: FormData;
  validationStatus: ValidationStatus; // Atualizado
  actions: {
    nextStep: () => void;
    prevStep: () => void;
    setFormData: (data: Partial<FormData>) => void;
    setValidationStatus: (status: Partial<ValidationStatus>) => void;
    goToStep: (step: number) => void;
    reset: () => void;
  }
};

const initialState = {
  currentStep: 1,
  formData: {
    fullName: "",
    cpf: "",
    email: "",
    phone: "",
    state: "",
    consent: false,
     // --- VALORES INICIAIS ADICIONADOS ---
    birthDate: "",
    gender: "",
    income: "",
    profession: "",
  },
  // Estado inicial para a validação (null significa sem erro)
  validationStatus: {
    fullNameError: null,
    cpfError: null,
    emailError: null,
    phoneError: null,
    stateError: null,
    // --- VALORES INICIAIS ADICIONADOS ---
    birthDateError: null,
    genderError: null,
    incomeError: null,
    professionError: null,
  },
};

export const useSimulatorStore = create<SimulatorState>((set) => ({
  ...initialState,
  actions: {
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    goToStep: (step) => set({ currentStep: step }),
    setFormData: (data) => set((state) => ({ 
      formData: { ...state.formData, ...data } 
    })),
    setValidationStatus: (status) => set((state) => ({
      validationStatus: { ...state.validationStatus, ...status }
    })),
    reset: () => set(initialState),
  }
}));