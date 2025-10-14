// src/components/simulator/NavigationButtons.tsx
"use client";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSimulatorStore } from '@/stores/useSimulatorStore';

type NavigationButtonsProps = { isNextDisabled?: boolean; nextLabel?: string; };

export const NavigationButtons = ({ isNextDisabled = false, nextLabel = "Próximo" }: NavigationButtonsProps) => {
  const currentStep = useSimulatorStore((state) => state.currentStep);
  const { prevStep } = useSimulatorStore((state) => state.actions);

  const showBackButton = currentStep > 1;

  return (
    <div className={`mt-8 pt-6 border-t border-border flex ${showBackButton ? 'justify-between' : 'justify-end'}`}>
      {showBackButton && (
        <Button type="button" variant="ghost" onClick={prevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      )}
      <Button type="submit" disabled={isNextDisabled}>
        {nextLabel}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};