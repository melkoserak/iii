"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. Importe o useRouter
import { NavigationButtons } from '../NavigationButtons';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';

export const Step1 = () => {
  const router = useRouter(); // 2. Inicialize o roteador
  const fullName = useSimulatorStore((state) => state.formData.fullName);
  const fullNameError = useSimulatorStore((state) => state.validationStatus.fullNameError);
  const currentStep = useSimulatorStore((state) => state.currentStep);
  const { setFormData, setValidationStatus } = useSimulatorStore((state) => state.actions);

  const [isTouched, setIsTouched] = useState(false);
  const isFullNameValid = !fullNameError && fullName.length > 0;

  useEffect(() => {
    if (isTouched) {
      const isValid = fullName.trim().includes(' ') && fullName.trim().split(' ').length > 1;
      setValidationStatus({ fullNameError: isValid ? null : "Por favor, digite seu nome completo." });
    }
  }, [fullName, setValidationStatus, isTouched]);

  // --- CORREÇÃO APLICADA AQUI ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFullNameValid) {
      // 3. Use o router para navegar para a próxima URL
      router.push(`/simulador/${currentStep + 1}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 className="text-2xl font-medium text-center mb-8 text-foreground">Primeiramente, nos diga seu nome completo</h3>
      <div>
        <label htmlFor="fullName" className="block text-sm font-bold text-gray-600 mb-1">
          Nome completo <span className="text-red-500">*</span>
        </label>
        <div className="relative flex items-center">
          <Input
            type="text"
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={(e) => setFormData({ fullName: e.target.value })}
            onBlur={() => setIsTouched(true)}
            className={`h-12 px-4 py-3 pr-10 ${fullNameError && isTouched ? 'border-destructive' : ''}`}
            placeholder="Seu nome completo"
            required
          />
          {isFullNameValid && isTouched && (
             <Check className="absolute right-3 h-5 w-5 text-green-500" />
          )}
        </div>
        {fullNameError && isTouched && <p className="text-sm text-destructive mt-1">{fullNameError}</p>}
      </div>
      <NavigationButtons isNextDisabled={!isFullNameValid} />
    </form>
  );
};