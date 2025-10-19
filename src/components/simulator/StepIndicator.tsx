"use client";
import React from 'react';

// Tipagem para as props do componente
type StepIndicatorProps = {
  currentStep: number;
};

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
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