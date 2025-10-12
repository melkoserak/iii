"use client";
import React from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';

// Importa os componentes de passo
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3'; // <<<--- IMPORTE O NOVO PASSO
import { StepIndicator } from './StepIndicator'; // <<<--- CORREÇÃO: Importe o novo componente

export const SimulatorForm = () => {
  const currentStep = useSimulatorStore((state) => state.currentStep);

  return (
    <div className="bg-white w-full max-w-5xl p-10 rounded-lg shadow-sm">
      {/* O código do StepIndicator foi removido daqui e agora ele é importado */}
      <StepIndicator currentStep={currentStep} />
      
      <div className="mt-8">
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />} 
      </div>
    </div>
  );
};