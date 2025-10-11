"use client";
import React from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';

// Importa os componentes de passo
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = ["Dados iniciais", "Proposta de seguro", "Complemento dos dados", "Contratação"];
    return (
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between mb-10">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
    
            return (
              <React.Fragment key={stepNumber}>
                <div className="flex flex-col items-center text-center w-24">
                  <div
                    className={`
                      w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold mb-2 transition-all duration-300
                      ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : ''}
                      ${isActive ? 'border-primary text-primary' : ''}
                      ${!isActive && !isCompleted ? 'border-border text-gray-400' : ''}
                    `}
                  >
                    {stepNumber}
                  </div>
                  <div
                    className={`
                      text-sm transition-all duration-300
                      ${isActive ? 'font-bold text-foreground' : 'text-gray-400'}
                    `}
                  >
                    {label}
                  </div>
                </div>
                {stepNumber < steps.length && (
                  <div className={`flex-grow h-0.5 -mt-8 mx-[-20px] transition-colors duration-300 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      );
};

export const SimulatorForm = () => {
  const currentStep = useSimulatorStore((state) => state.currentStep);

  return (
    <div className="bg-white w-full max-w-5xl p-10 rounded-lg shadow-sm">
      <StepIndicator currentStep={currentStep} />
      
      <div className="mt-8">
        {currentStep === 1 && <Step1 />}
        {/* --- PASSO 2 ADICIONADO --- */}
        {currentStep === 2 && <Step2 />}
      </div>
    </div>
  );
};