// src/components/simulator/NavigationButtons.tsx
"use client";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSimulatorStore } from '@/stores/useSimulatorStore';

type NavigationButtonsProps = { 
  isNextDisabled?: boolean; 
  nextLabel?: string; 
  showNextButton?: boolean; 
};

export const NavigationButtons = ({ 
  isNextDisabled = false, 
  nextLabel = "Próximo", 
  showNextButton = true
}: NavigationButtonsProps) => {
  const currentStep = useSimulatorStore((state) => state.currentStep);
  const { prevStep } = useSimulatorStore((state) => state.actions);

  const showBackButton = currentStep > 1;

  // --- INÍCIO DA CORREÇÃO ---
  // Lógica de alinhamento aprimorada para cobrir todos os casos
  let justifyClass = 'justify-end'; // Padrão: Apenas o botão "Próximo"
  if (showBackButton && showNextButton) {
    justifyClass = 'justify-between'; // Ambos os botões
  } else if (showBackButton && !showNextButton) {
    justifyClass = 'justify-start'; // Apenas o botão "Voltar"
  }
  // --- FIM DA CORREÇÃO ---

  return (
    <div className={`mt-8 pt-6 border-t border-border flex ${justifyClass}`}>
      {showBackButton && (
        <Button type="button" variant="ghost" onClick={prevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      )}
      
      {showNextButton && (
        <Button type="submit" disabled={isNextDisabled}>
          {nextLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};