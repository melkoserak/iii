// src/components/simulator/steps/Step5.tsx
"use client";
import React, { useEffect, useMemo } from 'react'; // 1. IMPORTE o useMemo
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
import { NavigationButtons } from '../NavigationButtons';
import { formatCurrency } from '@/lib/utils';
import { track } from '@/lib/tracking';

export const Step5 = () => {
  const { fullName } = useSimulatorStore((state) => state.formData);
  const { nextStep } = useSimulatorStore((state) => state.actions);

  // --- INÍCIO DA CORREÇÃO ---
  // 2. Selecionamos o array completo de coberturas, que é um estado estável.
  const allCoverages = useCoverageStore((state) => state.coverages);
  const getCalculatedPremium = useCoverageStore((state) => state.getCalculatedPremium);
  const totalPremium = useCoverageStore((state) => state.getTotalPremium());

  // 3. Usamos useMemo para calcular o array de coberturas ativas.
  //    Isso só será recalculado se 'allCoverages' mudar, evitando o loop.
  const activeCoverages = useMemo(
    () => allCoverages.filter(c => c.isActive),
    [allCoverages]
  );
  // --- FIM DA CORREÇÃO ---

  const firstName = fullName.split(' ')[0] || "";

  useEffect(() => {
    track('step_view', { step: 5, step_name: 'Resumo da Proposta' });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track('step_complete', { step: 5, step_name: 'Resumo da Proposta' });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-2 text-foreground outline-none">
        {firstName}, sua cobertura ficou assim:
      </h3>
      <p className="text-left text-muted-foreground mb-8">
        Confira o resumo das coberturas que você selecionou.
      </p>

      <div className="space-y-4 rounded-md border p-4">
        {activeCoverages.map(coverage => (
          <div key={coverage.id} className="flex justify-between items-center border-b last:border-none  py-2">
            <div>
              <p className="font-medium text-foreground ">{coverage.name.replace(/_/g, ' ')}</p>
              <p className="text-sm text-muted-foreground">Indenização de {formatCurrency(coverage.currentCapital)}</p>
            </div>
            <p className="font-semibold text-foreground">{formatCurrency(getCalculatedPremium(coverage))}/mês</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-between items-center rounded-md border bg-muted/50 p-4">
          <p className="text-lg font-bold text-foreground">Valor total mensal:</p>
          <p className="text-xl font-bold text-primary">{formatCurrency(totalPremium)}</p>
      </div>

      <NavigationButtons nextLabel="Iniciar contratação" />
    </form>
  );
};