// src/components/simulator/steps/step4/SummaryBar.tsx
"use client";
import { useCoverageStore } from '@/stores/useCoverageStore';
import { formatCurrency } from '@/lib/utils';

export const SummaryBar = () => {
  const totalPremium = useCoverageStore((state) => state.getTotalPremium());
  const totalIndemnity = useCoverageStore((state) => state.getTotalIndemnity());

  // Se não houver prêmio, não mostramos nada.
  if (totalPremium <= 0) {
    return null;
  }

  return (
    // Removemos os estilos de barra fixa e os botões.
    // Agora é uma seção dentro do formulário com uma borda superior.
    <div className="w-full flex justify-between border rounded border-primary gap-16 mt-8 py-4 px-8 px-* bg-slate-50">
      <div className="text-left">
          <p className="text-sm text-muted-foreground">Indenização Total</p>
          <p className="font-bold text-xl text-foreground">{formatCurrency(totalIndemnity)}</p>
      </div>
      <div className="text-right">
          <p className="text-sm text-muted-foreground">Valor Mensal</p>
          <p className="font-bold text-xl text-primary">{formatCurrency(totalPremium)}</p>
      </div>
    </div>
  );
};