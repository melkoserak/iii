// src/components/simulator/steps/Step3.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { NavigationButtons } from '../NavigationButtons';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Input } from '@/components/ui/input';
import { getProfessions, ProfessionOption } from '@/services/apiService';
import { Check } from 'lucide-react';
import { event as gtmEvent } from '@/lib/gtm'; // 1. Importe a função de evento do GTM
import { track } from '@/lib/tracking';

export const Step3 = () => {
  // --- Seleção Otimizada para evitar loops ---
  const { birthDate, gender, income, profession, fullName } = useSimulatorStore((state) => state.formData);
  const { birthDateError, genderError, incomeError, professionError } = useSimulatorStore((state) => state.validationStatus);
  const { setFormData, setValidationStatus, nextStep } = useSimulatorStore((state) => state.actions);

  const [professions, setProfessions] = useState<ProfessionOption[]>([]);
  const [isLoadingProfessions, setIsLoadingProfessions] = useState(true);
  
  const [touchedFields, setTouchedFields] = useState({
    birthDate: false,
    gender: false,
    income: false,
    profession: false,
  });

  const handleBlur = (field: keyof typeof touchedFields) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const firstName = fullName.split(' ')[0] || "";

  useEffect(() => {
    const loadProfessions = async () => {
      setIsLoadingProfessions(true);
      const data = await getProfessions();
      setProfessions(data);
      setIsLoadingProfessions(false);
    };
    loadProfessions();
  }, []);
  
  useEffect(() => {
    setValidationStatus({
      birthDateError: birthDate ? null : 'Campo obrigatório',
      genderError: gender ? null : 'Campo obrigatório',
      incomeError: income ? null : 'Campo obrigatório',
      professionError: profession ? null : 'Campo obrigatório',
    });
  }, [birthDate, gender, income, profession, setValidationStatus]);

  const isFormValid = !birthDateError && !genderError && !incomeError && !professionError;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      track('step_complete', {
        step: 3,
        step_name: 'Detalhes da Simulação',
        form_data: {
          income_bracket: income,       // Envia o valor (ex: "5000")
          profession_code: profession,  // Envia o código CBO (ex: "010105")
        },
      });
      nextStep();
    } else {
      setTouchedFields({ birthDate: true, gender: true, income: true, profession: true });
    }
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
      {/* 3. Adicione o tabIndex para acessibilidade */}
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-8 text-foreground outline-none">
        Perfeito {firstName}! Só mais alguns detalhes para a simulação:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="birthDate" className="block text-sm font-bold text-gray-600 mb-1">Data de Nascimento <span className="text-red-500">*</span></label>
          <div className="relative flex items-center">
            <Input type="date" id="birthDate" value={birthDate} 
              onChange={(e) => setFormData({ birthDate: e.target.value })} 
              onBlur={() => handleBlur('birthDate')}
              className={`h-12 px-4 py-3 ${touchedFields.birthDate && birthDateError ? 'border-destructive' : ''}`} required />
          </div>
          {touchedFields.birthDate && birthDateError && <p className="text-sm text-destructive mt-1">{birthDateError}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Sexo <span className="text-red-500">*</span></label>
          <div className="flex gap-4 mt-2" onBlur={() => handleBlur('gender')}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="gender" value="masculino" checked={gender === 'masculino'} 
                onChange={(e) => setFormData({ gender: e.target.value })} className="h-4 w-4 text-primary focus:ring-primary" /> Masculino
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="gender" value="feminino" checked={gender === 'feminino'} 
                onChange={(e) => setFormData({ gender: e.target.value })} className="h-4 w-4 text-primary focus:ring-primary" /> Feminino
            </label>
          </div>
           {touchedFields.gender && genderError && <p className="text-sm text-destructive mt-1">{genderError}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Faixa de Renda Mensal <span className="text-red-500">*</span></label>
          <div onBlur={() => handleBlur('income')}>
            <Autocomplete options={incomeOptions} value={income} 
              onChange={(value) => setFormData({ income: value })} 
              className={`${touchedFields.income && incomeError ? 'border-destructive' : ''}`}
              placeholder="Selecione..." />
          </div>
          {touchedFields.income && incomeError && <p className="text-sm text-destructive mt-1">{incomeError}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Profissão <span className="text-red-500">*</span></label>
          <div className="relative flex items-center" onBlur={() => handleBlur('profession')}>
            <Autocomplete 
              options={professions} 
              value={profession} 
              onChange={(value) => setFormData({ profession: value })} 
              placeholder={isLoadingProfessions ? "Carregando profissões..." : "Digite para buscar..."}
              isLoading={isLoadingProfessions}
              className={`${touchedFields.profession && professionError ? 'border-destructive' : ''}`} 
            />
            {!professionError && profession && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 pointer-events-none" />}
          </div>
          {touchedFields.profession && professionError && <p className="text-sm text-destructive mt-1">{professionError}</p>}
        </div>
      </div>
      <NavigationButtons isNextDisabled={!isFormValid} nextLabel="Ver Opções de Seguro →" />
    </form>
  );
};