// src/components/simulator/steps/step4/CoverageCard.tsx
"use client";
import { useState } from 'react';
import { useCoverageStore, Coverage } from '@/stores/useCoverageStore';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { CoverageDetailsDialog } from './CoverageDetailsDialog'; // Importe o nosso novo modal

export const CoverageCard = ({ coverage }: { coverage: Coverage }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); // Estado para controlar o modal
  const toggleCoverage = useCoverageStore((state) => state.toggleCoverage);
  const updateCapital = useCoverageStore((state) => state.updateCapital);
  const getCalculatedPremium = useCoverageStore((state) => state.getCalculatedPremium);
  
  const premium = getCalculatedPremium(coverage);

  return (
    <>
      <div className={`border rounded-lg p-6 mb-4 transition-opacity ${coverage.isActive ? 'opacity-100' : 'opacity-60 bg-gray-50'}`}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-bold text-foreground">{coverage.name.replace(/_/g, ' ')}</h4>
            {coverage.isMandatory && <span className="text-xs font-semibold text-primary">OBRIGATÓRIO</span>}
          </div>
          <Switch
            checked={coverage.isActive}
            onCheckedChange={() => toggleCoverage(coverage.id)}
            disabled={coverage.isMandatory}
            aria-label={`Ativar/desativar cobertura ${coverage.name}`}
          />
        </div>
        
        {/* AGORA USAMOS A DESCRIÇÃO CURTA AQUI */}
        <p className="text-sm text-muted-foreground mt-2" dangerouslySetInnerHTML={{ __html: coverage.description }} />

        {coverage.isAdjustable && coverage.isActive && (
          <div className="mt-6">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">Valor da Indenização</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(coverage.currentCapital)}</p>
            </div>
            <Slider
              min={coverage.minCapital}
              max={coverage.maxCapital}
              step={1000}
              value={[coverage.currentCapital]}
              onValueChange={(value: number[]) => updateCapital(coverage.id, value[0])}
              aria-label={`Ajustar capital para ${coverage.name}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{formatCurrency(coverage.minCapital)}</span>
              <span>{formatCurrency(coverage.maxCapital)}</span>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <div>
            <span className="text-sm text-muted-foreground">Valor mensal:</span>
            <p className="text-lg font-bold">{formatCurrency(premium)}</p>
          </div>
          {/* BOTÃO PARA ABRIR O MODAL */}
          <Button variant="ghost" className="text-primary hover:text-primary" onClick={() => setIsDetailsOpen(true)}>
            Ver detalhes e carências <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* O MODAL EM SI, INVISÍVEL ATÉ SER ATIVADO */}
      <CoverageDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={coverage.name}
        htmlContent={coverage.longDescription}
      />
    </>
  );
};