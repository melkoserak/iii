// src/components/simulator/steps/step4/CoverageCard.tsx
"use client";
import { useCoverageStore, Coverage } from '@/stores/useCoverageStore';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { formatCurrency, stripHtml } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { CoverageDetailsSheet } from './CoverageDetailsSheet'; // 1. Importe o novo componente

export const CoverageCard = ({ coverage }: { coverage: Coverage }) => {
  // 2. Remova o useState, não é mais necessário
  // const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const toggleCoverage = useCoverageStore((state) => state.toggleCoverage);
  const updateCapital = useCoverageStore((state) => state.updateCapital);
  const getCalculatedPremium = useCoverageStore((state) => state.getCalculatedPremium);
  
  const premium = getCalculatedPremium(coverage);

  return (
    <div className={`border rounded-lg p-6 mb-4 transition-colors duration-300 ${!coverage.isActive ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-bold text-foreground">{coverage.name.replace(/_/g, ' ')}</h4>
          {coverage.isMandatory && <span className="text-xs font-semibold text-primary">OBRIGATÓRIO</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-foreground">Adicionar ao plano</span>
          <Switch
            checked={coverage.isActive}
            onCheckedChange={() => toggleCoverage(coverage.id)}
            disabled={coverage.isMandatory}
            aria-label={`Ativar/desativar cobertura ${coverage.name}`}
          />
        </div>
      </div>
      
      <p className="text-base text-muted-foreground mt-2">
        {stripHtml(coverage.description)}
      </p>

      {coverage.isActive && (
        <div className="animate-fade-in">
          {coverage.isAdjustable && (
            <div className="mt-6">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">Valor da Indenização</p>
                <p className="text-4xl font-bold text-primary">{formatCurrency(coverage.currentCapital)}</p>
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

            {/* 3. Envolva o botão com o novo componente Sheet */}
            <CoverageDetailsSheet title={coverage.name} htmlContent={coverage.longDescription}>
              <Button variant="ghost" className="text-foreground hover:text-foreground/80">
                Ver detalhes e carências <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CoverageDetailsSheet>

          </div>
        </div>
      )}
    </div>
  );
};