"use client";
import { NavigationButtons } from '../NavigationButtons';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { IMaskInput } from 'react-imask';
import { Autocomplete } from '@/components/ui/autocomplete';

export const Step2 = () => {
  // --- INÍCIO DA CORREÇÃO DEFINITIVA ---
  // Selecionamos os dados (que mudam) e as ações (que são estáticas) em chamadas separadas.
  // Isso elimina o aviso de loop infinito da forma mais correta.
  const formData = useSimulatorStore((state) => state.formData);
  const { setFormData, nextStep } = useSimulatorStore((state) => state.actions);
  // --- FIM DA CORREÇÃO ---
  
  const firstName = formData.fullName.split(' ')[0] || "";

  const isFormValid = 
    formData.cpf.length > 0 && 
    formData.email.includes('@') &&
    formData.phone.length > 0 &&
    formData.state !== "" &&
    formData.consent === true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      nextStep();
    }
  };

  const brazilianStates = [
    { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' }, { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' }, { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' }, { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' }, { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' }, { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' }, { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' }, { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 className="text-2xl font-medium text-center mb-8 text-foreground">
        Certo {firstName}, agora precisamos destes dados de contato:
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="cpf" className="block text-sm font-bold text-gray-600 mb-1">Seu CPF <span className="text-red-500">*</span></label>
          <input type="text" id="cpf" value={formData.cpf} onChange={(e) => setFormData({ cpf: e.target.value })}
            className="w-full h-12 px-4 py-3 bg-white border border-border rounded-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="000.000.000-00" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-600 mb-1">E-mail <span className="text-red-500">*</span></label>
          <input type="email" id="email" value={formData.email} onChange={(e) => setFormData({ email: e.target.value })}
            className="w-full h-12 px-4 py-3 bg-white border border-border rounded-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="seu.melhor.email@exemplo.com" required />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-bold text-gray-600 mb-1">Nº de Celular (DDD) <span className="text-red-500">*</span></label>
          <IMaskInput
            mask="(00) 00000-0000"
            id="phone"
            value={formData.phone}
            onAccept={(value) => setFormData({ phone: value as string })}
            className="w-full h-12 px-4 py-3 bg-white border border-border rounded-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="(XX) XXXXX-XXXX"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Estado <span className="text-red-500">*</span></label>
          <Autocomplete 
            options={brazilianStates}
            value={formData.state}
            onChange={(value) => setFormData({ state: value })}
            placeholder="Selecione o estado..."
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          <input type="checkbox" id="consent" checked={formData.consent} onChange={(e) => setFormData({ consent: e.target.checked })}
            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" required />
          <label htmlFor="consent" className="text-sm text-gray-600">
            Li e aceito os <a href="/termos-de-uso" target="_blank" className="text-primary hover:underline">Termos</a> e <a href="/politica-de-privacidade" target="_blank" className="text-primary hover:underline">Política de Privacidade</a>. <span className="text-red-500">*</span>
          </label>
        </div>
      </div>

      <NavigationButtons isNextDisabled={!isFormValid} />
    </form>
  );
};