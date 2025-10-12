"use client";
import React, { useEffect, useState } from 'react';
import { NavigationButtons } from '../NavigationButtons';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Input } from '@/components/ui/input';
import { getProfessions, ProfessionOption } from '@/services/apiService';
import { Check } from 'lucide-react';

export const Step3 = () => {
  const formData = useSimulatorStore((state) => state.formData);
  const validationStatus = useSimulatorStore((state) => state.validationStatus);
  const { setFormData, nextStep, setValidationStatus } = useSimulatorStore((state) => state.actions);
  
  // --- INÍCIO DA CORREÇÃO ---
  // Declaração dos estados que estavam faltando
  const [professions, setProfessions] = useState<ProfessionOption[]>([]);
  const [isLoadingProfessions, setIsLoadingProfessions] = useState(true);
  
  const [touchedFields, setTouchedFields] = useState({
    birthDate: false,
    gender: false,
    income: false,
    profession: false,
  });

  // Declaração da função que estava faltando
  const handleBlur = (field: keyof typeof touchedFields) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };
  // --- FIM DA CORREÇÃO ---

  const firstName = formData.fullName.split(' ')[0] || "";

  // Busca as profissões quando o componente é montado
   useEffect(() => {
    const loadProfessions = async () => {
      setIsLoadingProfessions(true); // Inicia o estado de carregamento
      const data = await getProfessions();
      setProfessions(data);
      setIsLoadingProfessions(false); // Finaliza o estado de carregamento
    };
    loadProfessions();
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ [field]: value });
    // Validação simples
    const errorField = `${field}Error` as keyof typeof validationStatus;
    setValidationStatus({ [errorField]: value.trim() ? null : 'Campo obrigatório' });
  };
  
  const isFormValid = !validationStatus.birthDateError && !validationStatus.genderError && !validationStatus.incomeError && !validationStatus.professionError;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) nextStep();
  };

  const incomeOptions = [
    { value: '2000', label: 'R$ 0 a R$ 2.000' },
    { value: '5000', label: 'R$ 2.001 a R$ 5.000' },
    { value: '8000', label: 'R$ 5.001 a R$ 8.000' },
    { value: '11999', label: 'R$ 8.001 a R$ 11.999' },
    { value: '15000', label: 'Acima de R$ 12.000' },
  ];

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 className="text-2xl font-medium text-center mb-8 text-foreground">
        Perfeito {firstName}! Só mais alguns detalhes para a simulação:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="birthDate" className="block text-sm font-bold text-gray-600 mb-1">Data de Nascimento <span className="text-red-500">*</span></label>
          <div className="relative flex items-center">
            <Input type="date" id="birthDate" value={formData.birthDate} 
              onChange={(e) => handleInputChange('birthDate', e.target.value)} 
              className="h-12 px-4 py-3" required />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Sexo <span className="text-red-500">*</span></label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="gender" value="masculino" checked={formData.gender === 'masculino'} 
                onChange={(e) => handleInputChange('gender', e.target.value)} className="h-4 w-4 text-primary focus:ring-primary" /> Masculino
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="gender" value="feminino" checked={formData.gender === 'feminino'} 
                onChange={(e) => handleInputChange('gender', e.target.value)} className="h-4 w-4 text-primary focus:ring-primary" /> Feminino
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Faixa de Renda Mensal <span className="text-red-500">*</span></label>
          <Autocomplete options={incomeOptions} value={formData.income} 
            onChange={(value) => handleInputChange('income', value)} placeholder="Selecione..." />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Profissão <span className="text-red-500">*</span></label>
          <div className="relative flex items-center" onBlur={() => handleBlur('profession')}>
            {/* --- ATUALIZAÇÃO APLICADA --- */}
            <Autocomplete 
              options={professions} 
              value={formData.profession} 
              onChange={(value) => setFormData({ profession: value })} 
              placeholder={isLoadingProfessions ? "Carregando profissões..." : "Digite para buscar..."}
              isLoading={isLoadingProfessions} // Passa o estado para o componente
              className={`${validationStatus.professionError && touchedFields.profession ? 'border-destructive' : ''}`} 
            />
            {!validationStatus.professionError && formData.profession && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 pointer-events-none" />}
          </div>
          {validationStatus.professionError && touchedFields.profession && <p className="text-sm text-destructive mt-1">{validationStatus.professionError}</p>}
        </div>
      </div>
      <NavigationButtons isNextDisabled={!isFormValid} nextLabel="Ver Opções de Seguro →" />
    </form>
  );
};