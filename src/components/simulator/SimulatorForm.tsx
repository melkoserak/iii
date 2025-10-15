// src/components/simulator/SimulatorForm.tsx
"use client";
import React, { useEffect, useRef } from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import { Step4 } from './steps/Step4';
import { Step5 } from './steps/Step5'; // Novo passo de resumo
import { Step6 } from './steps/Step6'; // Novo passo de endereço
import { Step7 } from './steps/Step7'; // 1. IMPORTE O NOVO PASSO
import { Step8 } from './steps/Step8'; // <-- IMPORTE O NOVO PASSO
import { Step9 } from './steps/Step9'; // <-- IMPORTE O NOVO PASSO
import { Step10 } from './steps/Step10'; // <-- IMPORTE O NOVO PASSO

import { StepIndicator } from './StepIndicator';

const stepTitles: { [key: number]: string } = {
  1: 'Passo 1: Dados Iniciais',
  2: 'Passo 2: Dados de Contato',
  3: 'Passo 3: Detalhes da Simulação',
  4: 'Passo 4: Personalize o seu Seguro',
  5: 'Passo 5: Resumo da Proposta',
  6: 'Passo 6: Dados Complementares',
  7: 'Passo 7: Perfil Detalhado',
  8: 'Passo 8: Beneficiários', // <-- ADICIONE O TÍTULO
  9: 'Passo 9: Questionário de Saúde', // <-- ADICIONE O TÍTULO
  10: 'Passo 10: Pagamento', // <-- ADICIONE O TÍTULO
};

const getMainStep = (step: number) => {
  if (step <= 3) return 1; // Dados Iniciais
  if (step === 4) return 2; // Proposta de seguro
  if (step >= 5 && step <= 8) return 3; // Complemento dos dados
  if (step >= 9) return 4; // Contratação (inicia no passo 9)
  return 1;
};

export const SimulatorForm = () => {
  const currentStep = useSimulatorStore((state) => state.currentStep);
  const formRef = useRef<HTMLDivElement>(null);
  const hydrateFromStorage = useSimulatorStore((state) => state.actions.hydrateFromStorage);
  
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

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
<       StepIndicator currentStep={getMainStep(currentStep)} />     
       <div className="mt-8">
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
        {currentStep === 4 && <Step4 />}
        {currentStep === 5 && <Step5 />}
        {currentStep === 6 && <Step6 />}
        {currentStep === 7 && <Step7 />} {/* 2. ADICIONE O NOVO PASSO */}
        {currentStep === 8 && <Step8 />} {/* <-- ADICIONE A RENDERIZAÇÃO */}
        {currentStep === 9 && <Step9 />} {/* <-- ADICIONE A RENDERIZAÇÃO */}
        {currentStep === 10 && <Step10 />} {/* <-- ADICIONE A RENDERIZAÇÃO */}
      </div>
    </div>
  );
};