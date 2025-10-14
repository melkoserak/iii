// src/components/simulator/steps/step4/SummaryBar.tsx
"use client";
import { useCoverageStore } from '@/stores/useCoverageStore';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { ArrowLeft } from 'lucide-react';

export const SummaryBar = () => {
  const totalPremium = useCoverageStore((state) => state.getTotalPremium());
  const totalIndemnity = useCoverageStore((state) => state.getTotalIndemnity());
  const { prevStep } = useSimulatorStore((state) => state.actions);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg flex justify-between items-center z-10">
      <Button variant="ghost" onClick={prevStep} className="text-white hover:bg-gray-700 hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <div className="flex-1 flex justify-center gap-8">
        <div className="text-center">
            <p className="text-xs opacity-70">Indenização Total</p>
            <p className="font-bold text-lg">{formatCurrency(totalIndemnity)}</p>
        </div>
        <div className="text-center">
            <p className="text-xs opacity-70">Valor Mensal</p>
            <p className="font-bold text-lg">{formatCurrency(totalPremium)}</p>
        </div>
      </div>
      <Button type="submit" disabled={totalPremium <= 0}>
        Continuar
      </Button>
    </div>
  );
};