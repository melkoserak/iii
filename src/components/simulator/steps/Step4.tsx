// src/components/simulator/steps/Step4.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
import { getSimulation } from '@/services/apiService';
import { track } from '@/lib/tracking';
import { Loader2, AlertTriangle } from 'lucide-react';
import { CoverageCard } from './step4/CoverageCard';
import { SummaryBar } from './step4/SummaryBar';
import { NavigationButtons } from '../NavigationButtons'; // 1. Importe os botões


const LoadingState = () => (
    <div className="flex flex-col items-center justify-center text-center p-10">
        <Loader2 className="animate-spin h-12 w-12 text-primary mb-4" />
        <p className="text-lg text-muted-foreground">A calcular as melhores opções para si...</p>
    </div>
);

const ErrorState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-destructive/10 border border-destructive rounded-lg">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg font-semibold text-destructive">Ocorreu um Erro</p>
        <p className="text-muted-foreground">{message}</p>
    </div>
);

export const Step4 = () => {
  const formData = useSimulatorStore((state) => state.formData);
  const firstName = formData.fullName.split(' ')[0] || "para você"; 
  const { nextStep } = useSimulatorStore((state) => state.actions);
  
  const coverages = useCoverageStore((state) => state.coverages);
  const setInitialCoverages = useCoverageStore((state) => state.setInitialCoverages);
  const mainSusep = useCoverageStore((state) => state.mainSusep);

   // --- INÍCIO DA CORREÇÃO ---
  const totalPremium = useCoverageStore((state) => state.getTotalPremium());
  // --- FIM DA CORREÇÃO ---

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- CONSOLE LOG AQUI ---
  console.log("DEBUG [Step4]: A renderizar. Coberturas atuais na store:", coverages);
  console.log("DEBUG [Step4]: SUSEP principal atual na store:", mainSusep);

  useEffect(() => {
    track('step_view', { step: 4, step_name: 'Resultados da Simulação' });

    const fetchSimulation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = {
          mag_nome_completo: formData.fullName,
          mag_cpf: formData.cpf,
          mag_data_nascimento: formData.birthDate,
          mag_sexo: formData.gender,
          mag_renda: formData.income,
          mag_estado: formData.state,
          mag_profissao_cbo: formData.profession,
        };
        const data = await getSimulation(payload);
        setInitialCoverages(data);
        
        track('simulation_success', { api_response_payload: data });

      } catch (err: any) {
        setError(err.message || 'Não foi possível carregar as opções. Tente novamente.');
        track('simulation_error', { error_message: err.message });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (coverages.length === 0) {
      console.log("DEBUG [Step4]: 'coverages' está vazio. A iniciar chamada à API.");
      fetchSimulation();
    } else {
      console.log("DEBUG [Step4]: 'coverages' já tem dados. A saltar chamada à API.");
      setIsLoading(false);
    }
  }, [formData, setInitialCoverages, coverages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track('step_complete', {
        step: 4,
        step_name: 'Personalização Concluída',
        final_selections: {
          total_premium: useCoverageStore.getState().getTotalPremium(),
          total_indemnity: useCoverageStore.getState().getTotalIndemnity(),
          selected_coverages: useCoverageStore.getState().coverages.filter(c => c.isActive).map(c => c.name),
        }
    });
    nextStep();
  };

  return (
    // 3. Removido o padding 'pb-24' que não é mais necessário
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-2 text-foreground outline-none">
        {isLoading ? "Aguarde um momento..." : `Personalize o seu seguro ideal, ${firstName}`}
      </h3>
      
      {!isLoading && mainSusep && (
        <p className="text-left text-sm text-muted-foreground mb-8">
          Produto principal (Processo SUSEP: {mainSusep})
        </p>
      )}
      
      {isLoading && <LoadingState />}
      {error && <ErrorState message={error} />}
      
      {!isLoading && !error && coverages.length > 0 && (
        <>
          <div>
            {coverages.map((coverage) => (
              <CoverageCard key={coverage.id} coverage={coverage} />
            ))}
          </div>
          
          {/* 4. A barra de resumo e os botões agora ficam no final do formulário */}
          <SummaryBar />
          <NavigationButtons 
            isNextDisabled={totalPremium <= 0} 
            nextLabel="Continuar" 
          />
        </>
      )}

      {!isLoading && !error && coverages.length === 0 && (
          <ErrorState message="Não encontrámos coberturas disponíveis para o seu perfil. Por favor, volte e verifique os seus dados." />
      )}
    </form>
  );
};