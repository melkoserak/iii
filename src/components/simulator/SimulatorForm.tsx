// src/components/simulator/SimulatorForm.tsx
"use client";
import React, { useEffect, useRef } from 'react'; // Adicione useEffect se não estiver lá
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import { Step4 } from './steps/Step4';
import { Step5 } from './steps/Step5';
import { Step6 } from './steps/Step6';
import { Step7 } from './steps/Step7';
import { Step8 } from './steps/Step8';
import { Step9 } from './steps/Step9';
import { Step10 } from './steps/Step10';
import { Step11 } from './steps/Step11';
import { StepIndicator } from './StepIndicator';


// Opcional: mantém os títulos para o <title> da página
const stepTitles: { [key: number]: string } = {
  1: 'Passo 1: Dados Iniciais',
  2: 'Passo 2: Dados de Contato',
  3: 'Passo 3: Detalhes da Simulação',
  4: 'Passo 4: Personalize o seu Seguro',
  5: 'Passo 5: Resumo da Proposta',
  6: 'Passo 6: Dados Complementares',
  7: 'Passo 7: Perfil Detalhado',
  8: 'Passo 8: Beneficiários',
  9: 'Passo 9: Questionário de Saúde',
  10: 'Passo 10: Pagamento',
  11: 'Passo 11: Finalização',
};

const getMainStep = (step: number) => {
  if (step <= 3) return 1;
  if (step === 4) return 2;
  if (step >= 5 && step <= 8) return 3;
  if (step >= 9) return 4;
  return 1;
};

export const SimulatorForm = () => {
 const currentStep = useSimulatorStore((state) => state.currentStep);
  const formRef = useRef<HTMLDivElement>(null);
  const hydrateFromStorage = useSimulatorStore((state) => state.actions.hydrateFromStorage);
  const fetchWpNonce = useSimulatorStore((state) => state.actions.fetchWpNonce); // <-- Pegue a ação
  
  useEffect(() => {
    hydrateFromStorage();
    fetchWpNonce(); // <-- Chame a ação para buscar o nonce
  }, [hydrateFromStorage, fetchWpNonce]);

  // Este useEffect continua útil para acessibilidade e título da página
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
       <StepIndicator currentStep={getMainStep(currentStep)} />     
       <div className="mt-8">
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
        {currentStep === 4 && <Step4 />}
        {currentStep === 5 && <Step5 />}
        {currentStep === 6 && <Step6 />}
        {currentStep === 7 && <Step7 />}
        {currentStep === 8 && <Step8 />}
        {currentStep === 9 && <Step9 />}
        {currentStep === 10 && <Step10 />}
        {currentStep === 11 && <Step11 />}
      </div>
    </div>
  );
};

