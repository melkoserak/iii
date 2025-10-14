// src/components/simulator/SimulatorForm.tsx
"use client";
import React, { useEffect, useRef } from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import { Step4 } from './steps/Step4';
import { StepIndicator } from './StepIndicator';

const stepTitles: { [key: number]: string } = {
  1: 'Passo 1: Dados Iniciais',
  2: 'Passo 2: Dados de Contato',
  3: 'Passo 3: Detalhes da Simulação',
  4: 'Passo 4: Personalize o seu Seguro',
};

export const SimulatorForm = () => {
  const currentStep = useSimulatorStore((state) => state.currentStep);
  const formRef = useRef<HTMLDivElement>(null);
  
  // --- NOVA LÓGICA DE CARREGAMENTO ---
  const hydrateFromStorage = useSimulatorStore((state) => state.actions.hydrateFromStorage);
  
  useEffect(() => {
    // Esta função será executada apenas uma vez, quando o componente for montado
    hydrateFromStorage();
  }, [hydrateFromStorage]);
  // --- FIM DA NOVA LÓGICA ---

  useEffect(() => {
    const title = stepTitles[currentStep] || 'Simulador';
    document.title = `${title} | Golden Bear Seguros`;
    if (formRef.current) {
      const heading = formRef.current.querySelector('h3');
      if (heading) {
        heading.focus();
      }
    }
  }, [currentStep]);

  return (
    <div ref={formRef} className="bg-white w-full max-w-5xl p-10 rounded-lg shadow-sm">
      <StepIndicator currentStep={currentStep} />
      <div className="mt-8">
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
        {currentStep === 4 && <Step4 />}
      </div>
    </div>
  );
};