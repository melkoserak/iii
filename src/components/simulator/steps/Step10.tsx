/// src/components/simulator/steps/Step10.tsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
// 1. IMPORTAMOS O 'IframeResizer' COM O NOME CORRETO
import IframeResizer from 'iframe-resizer-react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
import { getPaymentToken } from '@/services/apiService';
import { track } from '@/lib/tracking';
import { Loader2, AlertTriangle, CreditCard, Landmark } from 'lucide-react';
import { NavigationButtons } from '../NavigationButtons';
import { cn } from '@/lib/utils';

export const Step10 = () => {
  const { formData } = useSimulatorStore();
  const { paymentMethod, paymentPreAuthCode, cpf } = formData;
  const { setFormData, nextStep } = useSimulatorStore((state) => state.actions);
  const totalPremium = useCoverageStore((state) => state.getTotalPremium());
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  const [paymentToken, setPaymentToken] = useState<string | null>(null); // 1. Novo estado para o token
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    track('step_view', { step: 10, step_name: 'Pagamento' });
  }, []);
  
  useEffect(() => {
    // Limpa o widget se o método de pagamento for trocado
    setWidgetUrl(null);
    setPaymentToken(null);
    setError(null);
    setFormData({ paymentPreAuthCode: undefined });

    if (paymentMethod === 'credit') {
      const initializeWidget = async () => {
        setIsLoading(true);
        try {
          // 2. Buscamos o token e o guardamos no estado
          const { token } = await getPaymentToken();
          setPaymentToken(token);
          
          const totalValue = totalPremium.toFixed(2);
          const cleanedCpf = cpf.replace(/\D/g, '');
          
          const url = `https://widgetshmg.mongeralaegon.com.br/widget-cartao-credito/v3/?cnpj=33608308000173&acao=PreAutorizacao&valorCompra=${totalValue}&chave=cpf&valor=${cleanedCpf}&chave=ModeloProposta&valor=EIS`;
          // 3. Apenas definimos a URL para renderizar o iframe
          setWidgetUrl(url);

        } catch (err: any) {
          setError(err.message || 'Não foi possível carregar o ambiente de pagamento.');
          setIsLoading(false);
        }
      };

      initializeWidget();

    } else if (paymentMethod === 'debit') {
      setError("Opção de Débito em Conta ainda não disponível.");
    }

    const handleMessage = (event: MessageEvent) => {
        if (event.origin !== 'https://widgetshmg.mongeralaegon.com.br') return;
        if (typeof event.data === 'string' && event.data.startsWith('{')) {
            try {
                const data = JSON.parse(event.data);
                const preAuthCode = data?.Valor?.CodigoPreAutorizacao;
                if (preAuthCode) {
                    console.log("Código de pré-autorização recebido:", preAuthCode);
                    setFormData({ paymentPreAuthCode: preAuthCode });
                }
            } catch (e) { /* Ignora mensagens que não são JSON */ }
        }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);

  }, [paymentMethod, totalPremium, cpf, setFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentPreAuthCode) {
      track('step_complete', { step: 10, step_name: 'Pagamento', payment_method: 'credit' });
      nextStep();
    }
  };

  const isFormValid = !!paymentPreAuthCode;


  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-8 text-foreground outline-none">
        Como você gostaria de pagar?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div onClick={() => setFormData({ paymentMethod: 'credit' })} className={cn("rounded-lg border p-4 flex items-center gap-4 cursor-pointer transition-all", paymentMethod === 'credit' && 'ring-2 ring-primary border-primary')}>
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <p className="font-semibold">Cartão de Crédito</p>
            <p className="text-sm text-muted-foreground">Pagamento mensal recorrente.</p>
          </div>
        </div>
        <div onClick={() => setFormData({ paymentMethod: 'debit' })} className={cn("rounded-lg border p-4 flex items-center gap-4 cursor-pointer transition-all", paymentMethod === 'debit' && 'ring-2 ring-primary border-primary')}>
          <Landmark className="h-8 w-8 text-primary" />
          <div>
            <p className="font-semibold">Débito em Conta</p>
            <p className="text-sm text-muted-foreground">Desconto automático na sua conta.</p>
          </div>
        </div>
      </div>

      {paymentMethod && (
        <div className="relative border rounded-lg overflow-hidden h-full">
          {isLoading && ( <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10"><Loader2 className="animate-spin h-10 w-10 text-primary mb-4" /><p>Carregando ambiente de pagamento seguro...</p></div> )}
          {error && ( <div className="absolute inset-0 flex flex-col items-center justify-center p-4"><AlertTriangle className="h-10 w-10 text-destructive mb-4" /><p className="font-semibold text-destructive">{error}</p></div> )}
          
           {widgetUrl && !error && (
            <IframeResizer
              forwardRef={iframeRef}
              key={widgetUrl}
              src={widgetUrl}
              title="Widget de Pagamento MAG"
              checkOrigin={false}
              style={{ width: '1px', minWidth: '100%', border: 0, height: '100%', paddingTop: '48px' }}
              onLoad={() => {
                if (iframeRef.current && paymentToken) {
                  iframeRef.current.contentWindow?.postMessage({ event: 'notify', property: 'Auth', value: paymentToken }, 'https://widgetshmg.mongeralaegon.com.br');
                }
                setIsLoading(false);
              }}
            />
          )}
        </div>
      )}
      
      <NavigationButtons isNextDisabled={!isFormValid} />
    </form>
  );
};