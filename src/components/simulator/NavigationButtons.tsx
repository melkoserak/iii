"use client";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useRouter } from 'next/navigation'; // 1. Importe o useRouter

type NavigationButtonsProps = {
  isNextDisabled?: boolean;
  nextLabel?: string; 
};

export const NavigationButtons = ({ 
  isNextDisabled = false,
  nextLabel = "Próximo" 
}: NavigationButtonsProps) => {
  const currentStep = useSimulatorStore((state) => state.currentStep);
  const router = useRouter(); // 2. Inicialize o roteador

  // 3. Crie a função para voltar
  const handleBack = () => {
    if (currentStep > 1) {
      router.push(`/simulador/${currentStep - 1}`);
    }
  };

  const showBackButton = currentStep > 1;

  return (
    <div className={`mt-8 pt-6 border-t border-border flex ${showBackButton ? 'justify-between' : 'justify-end'}`}>
      {showBackButton && (
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack} // 4. Use a nova função aqui
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      )}
      <Button
        type="submit"
        disabled={isNextDisabled}
      >
        {nextLabel}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};