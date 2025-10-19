// src/components/simulator/steps/Step7.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { IMaskMixin } from 'react-imask';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { NavigationButtons } from '../NavigationButtons';
import { Input } from '@/components/ui/input';
import { Autocomplete } from '@/components/ui/autocomplete';
import { track } from '@/lib/tracking';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Info } from 'lucide-react';
import { ppeContent } from '@/lib/ppe-content';

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

export const Step7 = () => {
  const {
    maritalStatus, rgNumber, rgIssuer, rgDate, childrenCount, company, isPPE, homePhone
  } = useSimulatorStore((state) => state.formData);
  const validationStatus = useSimulatorStore((state) => state.validationStatus);
  const { setFormData, setValidationStatus, nextStep } = useSimulatorStore((state) => state.actions);

  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  useEffect(() => {
    track('step_view', { step: 7, step_name: 'Perfil Detalhado' });
  }, []);

  // --- INÍCIO DA LÓGICA RESTAURADA ---
  useEffect(() => {
    setValidationStatus({
      maritalStatusError: maritalStatus ? null : 'Campo obrigatório.',
      rgNumberError: rgNumber.trim() ? null : 'Campo obrigatório.',
      rgIssuerError: rgIssuer.trim() ? null : 'Campo obrigatório.',
      rgDateError: rgDate ? null : 'Campo obrigatório.',
      childrenCountError: childrenCount.trim() && parseInt(childrenCount) >= 0 ? null : 'Valor inválido.',
      companyError: company.trim() ? null : 'Campo obrigatório.',
      isPPEError: isPPE ? null : 'Campo obrigatório.',
    });
  }, [maritalStatus, rgNumber, rgIssuer, rgDate, childrenCount, company, isPPE, setValidationStatus]);

  const isFormValid =
    !validationStatus.maritalStatusError && !validationStatus.rgNumberError &&
    !validationStatus.rgIssuerError && !validationStatus.rgDateError &&
    !validationStatus.childrenCountError && !validationStatus.companyError &&
    !validationStatus.isPPEError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      track('step_complete', { step: 7, step_name: 'Perfil Detalhado' });
      nextStep();
    } else {
      setTouched({
        maritalStatus: true, rgNumber: true, rgIssuer: true, rgDate: true,
        childrenCount: true, company: true, isPPE: true
      });
    }
  };
  // --- FIM DA LÓGICA RESTAURADA ---

  const maritalStatusOptions = [
    { value: 'SOLTEIRO', label: 'Solteiro(a)' },
    { value: 'CASADO', label: 'Casado(a)' },
    { value: 'DIVORCIADO', label: 'Divorciado(a)' },
    { value: 'VIUVO', label: 'Viúvo(a)' },
    { value: 'UNIAO_ESTAVEL', label: 'União Estável' },
  ];

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-8 text-foreground outline-none">
        Para finalizar, complete seu perfil:
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Estado Civil <span className="text-red-500">*</span></label>
          <div onBlur={() => handleBlur('maritalStatus')}>
            <Autocomplete options={maritalStatusOptions} value={maritalStatus} onChange={(v) => setFormData({ maritalStatus: v })} placeholder="Selecione..." />
          </div>
           {touched.maritalStatus && validationStatus.maritalStatusError && <p className="text-sm text-destructive mt-1">{validationStatus.maritalStatusError}</p>}
        </div>
        <div>
          <label htmlFor="homePhone" className="block text-sm font-bold text-gray-600 mb-1">Telefone Residencial (DDD)</label>
          <MaskedInput mask="(00) 0000-0000" id="homePhone" value={homePhone} onAccept={(value: string) => setFormData({ homePhone: value })} className="h-12" />
        </div>
        <div>
          <label htmlFor="rgNumber" className="block text-sm font-bold text-gray-600 mb-1">Número RG <span className="text-red-500">*</span></label>
          <MaskedInput mask="00.000.000-**" id="rgNumber" value={rgNumber} onAccept={(value: string) => setFormData({ rgNumber: value })} onBlur={() => handleBlur('rgNumber')} className="h-12" placeholder="Ex: 12.345.678-9" required />
          {touched.rgNumber && validationStatus.rgNumberError && <p className="text-sm text-destructive mt-1">{validationStatus.rgNumberError}</p>}
        </div>
        <div>
          <label htmlFor="rgIssuer" className="block text-sm font-bold text-gray-600 mb-1">Órgão Emissor RG <span className="text-red-500">*</span></label>
          <Input id="rgIssuer" value={rgIssuer} onChange={(e) => setFormData({ rgIssuer: e.target.value })} onBlur={() => handleBlur('rgIssuer')} className="h-12" placeholder="Ex: SSP/SP" required maxLength={10} />
          {touched.rgIssuer && validationStatus.rgIssuerError && <p className="text-sm text-destructive mt-1">{validationStatus.rgIssuerError}</p>}
        </div>
        <div>
          <label htmlFor="rgDate" className="block text-sm font-bold text-gray-600 mb-1">Data Emissão RG <span className="text-red-500">*</span></label>
          <Input type="date" id="rgDate" value={rgDate} onChange={(e) => setFormData({ rgDate: e.target.value })} onBlur={() => handleBlur('rgDate')} className="h-12" required />
          {touched.rgDate && validationStatus.rgDateError && <p className="text-sm text-destructive mt-1">{validationStatus.rgDateError}</p>}
        </div>
        <div>
          <label htmlFor="childrenCount" className="block text-sm font-bold text-gray-600 mb-1">Nº de Filhos <span className="text-red-500">*</span></label>
          <Input type="number" id="childrenCount" value={childrenCount} onChange={(e) => setFormData({ childrenCount: e.target.value })} onBlur={() => handleBlur('childrenCount')} min="0" className="h-12" required />
          {touched.childrenCount && validationStatus.childrenCountError && <p className="text-sm text-destructive mt-1">{validationStatus.childrenCountError}</p>}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="company" className="block text-sm font-bold text-gray-600 mb-1">Empresa/Instituição <span className="text-red-500">*</span></label>
          <Input id="company" value={company} onChange={(e) => setFormData({ company: e.target.value })} onBlur={() => handleBlur('company')} className="h-12" required />
          {touched.company && validationStatus.companyError && <p className="text-sm text-destructive mt-1">{validationStatus.companyError}</p>}
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-bold text-gray-600">
              É Pessoa Politicamente Exposta (PPE)? <span className="text-red-500">*</span>
            </label>
            <Sheet>
              <SheetTrigger asChild>
                <button type="button" aria-label="Saiba mais sobre Pessoa Politicamente Exposta">
                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
                </button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Pessoas Politicamente Expostas (PPE)</SheetTitle>
                </SheetHeader>
                {ppeContent}
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex gap-4 mt-2" onBlur={() => handleBlur('isPPE')}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="isPPE" value="true" checked={isPPE === 'true'} onChange={(e) => setFormData({ isPPE: e.target.value })} className="h-4 w-4 text-primary focus:ring-primary" required/> Sim
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="isPPE" value="false" checked={isPPE === 'false'} onChange={(e) => setFormData({ isPPE: e.target.value })} className="h-4 w-4 text-primary focus:ring-primary" /> Não
            </label>
          </div>
          {touched.isPPE && validationStatus.isPPEError && <p className="text-sm text-destructive mt-1">{validationStatus.isPPEError}</p>}
        </div>
      </div>

      <NavigationButtons isNextDisabled={!isFormValid} />
    </form>
  );
};