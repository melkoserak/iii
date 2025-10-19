"use client";
import { useEffect, useState } from 'react';
import { NavigationButtons } from '../NavigationButtons';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import { track } from '@/lib/tracking'; // 1. Importe a nova função 'track'

export const Step1 = () => {
  const fullName = useSimulatorStore((state) => state.formData.fullName);
  const fullNameError = useSimulatorStore((state) => state.validationStatus.fullNameError);
  const { nextStep, setFormData, setValidationStatus } = useSimulatorStore((state) => state.actions);

  const [isTouched, setIsTouched] = useState(false);
  const isFullNameValid = fullName.trim().includes(' ') && fullName.trim().split(' ').length > 1;

  // Trackeamento de visualização do passo
  useEffect(() => {
    track('step_view', {
      step: 1,
      step_name: 'Dados Iniciais',
    });
  }, []); // O array vazio garante que isto só executa uma vez

  useEffect(() => {
    if (isTouched) {
      setValidationStatus({ fullNameError: isFullNameValid ? null : "Por favor, digite seu nome completo." });
    }
  }, [fullName, isTouched, isFullNameValid, setValidationStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFullNameValid) {
      // 2. Dispare um evento de conclusão mais completo
      track('step_complete', {
        step: 1,
        step_name: 'Dados Iniciais',
        // Adicione qualquer informação relevante que já tenha
        form_data: {
          full_name_provided: true,
        },
      });
      nextStep();
    } else {
      setIsTouched(true);
      setValidationStatus({ fullNameError: "Por favor, digite seu nome completo." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-8 text-foreground outline-none">
        Primeiramente, nos diga seu nome completo
      </h3>
      <div>
        <label htmlFor="fullName" className="block text-sm font-bold text-gray-600 mb-1">
          Nome completo <span className="text-red-500">*</span>
        </label>
        <div className="relative flex items-center">
          <Input
            type="text" id="fullName" name="fullName" value={fullName}
            onChange={(e) => setFormData({ fullName: e.target.value })}
            onBlur={() => setIsTouched(true)}
            className={`h-12 px-4 py-3 pr-10 ${!isFullNameValid && isTouched ? 'border-destructive' : ''}`}
            placeholder="Seu nome completo" required
          />
          {isFullNameValid && <Check className="absolute right-3 h-5 w-5 text-green-500" />}
        </div>
        {!isFullNameValid && isTouched && <p className="text-sm text-destructive mt-1">{fullNameError}</p>}
      </div>
      <NavigationButtons isNextDisabled={!isFullNameValid} />
    </form>
  );
};