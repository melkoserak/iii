// src/components/simulator/steps/Step2.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { NavigationButtons } from '../NavigationButtons';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { IMaskMixin } from 'react-imask';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';   
import { track } from '@/lib/tracking';


const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

export const Step2 = () => {
  // --- INÍCIO DA CORREÇÃO ---
  // 1. Selecionamos os dados que o componente realmente precisa, um por um.
  const { cpf, email, phone, state, consent, fullName } = useSimulatorStore((state) => state.formData);
  const { cpfError, emailError, phoneError, stateError } = useSimulatorStore((state) => state.validationStatus);

  // 2. Selecionamos as ações (que são estáveis) separadamente.
  const { setFormData, setValidationStatus, nextStep } = useSimulatorStore((state) => state.actions);
  // --- FIM DA CORREÇÃO ---

  const firstName = fullName.split(' ')[0] || "";

  const [touched, setTouched] = useState({
    cpf: false,
    email: false,
    phone: false,
  });

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidationStatus({
      cpfError: cpf.replace(/[._-]/g, '').length === 11 ? null : "CPF inválido.",
      emailError: emailRegex.test(email) ? null : "E-mail inválido.",
      phoneError: phone.replace(/[()-\s]/g, '').length >= 10 ? null : "Celular inválido.",
      stateError: state ? null : "Selecione um estado.",
    });
  }, [cpf, email, phone, state, setValidationStatus]);

  const isFormValid = !cpfError && !emailError && !phoneError && !stateError && consent;

 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      track('step_complete', {
        step: 2,
        step_name: 'Dados de Contato',
        form_data: {
          state: state, // Envia a sigla do estado (ex: "SP")
        },
      });
      nextStep(); // Apenas avança o estado
    } else {
      setTouched({ cpf: true, email: true, phone: true });
    }
  };

  const brazilianStates = [
    { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' }, { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' }, { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' }, { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' }, { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' }, { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' }, { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' }, { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-8 text-foreground outline-none">
        Certo {firstName}, agora precisamos destes dados de contato:
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="cpf" className="block text-sm font-bold text-gray-600 mb-1">Seu CPF <span className="text-red-500">*</span></label>
          <div className="relative flex items-center">
            <MaskedInput mask="000.000.000-00" id="cpf" value={cpf} 
              onAccept={(value: string) => setFormData({ cpf: value })} 
              onBlur={() => handleBlur('cpf')}
              className={`h-12 px-4 py-3 pr-10 ${touched.cpf && cpfError ? 'border-destructive' : ''}`} 
              placeholder="000.000.000-00" required />
            {!cpfError && cpf && <Check className="absolute right-3 h-5 w-5 text-green-500" />}
          </div>
          {touched.cpf && cpfError && <p className="text-sm text-destructive mt-1">{cpfError}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-600 mb-1">E-mail <span className="text-red-500">*</span></label>
          <div className="relative flex items-center">
            <Input type="email" id="email" value={email} 
              onChange={(e) => setFormData({ email: e.target.value })}
              onBlur={() => handleBlur('email')}
              className={`h-12 px-4 py-3 pr-10 ${touched.email && emailError ? 'border-destructive' : ''}`} 
              placeholder="seu.melhor.email@exemplo.com" required />
            {!emailError && email && <Check className="absolute right-3 h-5 w-5 text-green-500" />}
          </div>
          {touched.email && emailError && <p className="text-sm text-destructive mt-1">{emailError}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-bold text-gray-600 mb-1">Nº de Celular (DDD) <span className="text-red-500">*</span></label>
          <div className="relative flex items-center">
            <MaskedInput mask="(00) 00000-0000" id="phone" value={phone} 
               onAccept={(value: string) => setFormData({ phone: value })}
              onBlur={() => handleBlur('phone')}
              className={`h-12 px-4 py-3 pr-10 ${touched.phone && phoneError ? 'border-destructive' : ''}`} 
              placeholder="(XX) XXXXX-XXXX" required />
            {!phoneError && phone && <Check className="absolute right-3 h-5 w-5 text-green-500" />}
          </div>
          {touched.phone && phoneError && <p className="text-sm text-destructive mt-1">{phoneError}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Estado <span className="text-red-500">*</span></label>
          <div className="relative flex items-center">
            <Autocomplete options={brazilianStates} value={state} onChange={(v) => setFormData({ state: v })} placeholder="Selecione o estado..." />
            {!stateError && state && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 pointer-events-none" />}
          </div>
        </div>

        <div className="md:col-span-2 flex items-center justify-end gap-3">       
          <input type="checkbox" id="consent" checked={consent} onChange={(e) => setFormData({ consent: e.target.checked })}
            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" required />
            <label htmlFor="consent" className="text-sm text-gray-600">
            Li e aceito os <a href="/termos-de-uso" target="_blank" className="text-primary hover:underline">Termos</a> e <a href="/politica-de-privacidade" target="_blank" className="text-primary hover:underline">Política de Privacidade</a>. <span className="text-red-500">*</span>
          </label>
        </div>
      </div>
      <NavigationButtons isNextDisabled={!isFormValid} />
    </form>
  );
};