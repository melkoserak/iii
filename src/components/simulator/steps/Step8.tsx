// src/components/simulator/steps/Step8.tsx
"use client";
import React, { useEffect, useMemo } from 'react';
import { IMaskMixin } from 'react-imask';
import { useSimulatorStore, Beneficiary } from '@/stores/useSimulatorStore';
import { NavigationButtons } from '../NavigationButtons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Autocomplete } from '@/components/ui/autocomplete';
import { track } from '@/lib/tracking';
import { PlusCircle, Trash2, AlertTriangle } from 'lucide-react';

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

// This is a sub-component for the beneficiary form fields
const BeneficiaryForm = ({ beneficiary, index }: { beneficiary: Beneficiary; index: number }) => {
  const { updateBeneficiary, removeBeneficiary } = useSimulatorStore((state) => state.actions);
  const beneficiaries = useSimulatorStore((state) => state.formData.beneficiaries);

  const isMinor = useMemo(() => {
    if (!beneficiary.birthDate) return false;
    const birthDateObj = new Date(`${beneficiary.birthDate}T00:00:00`);
    if (isNaN(birthDateObj.getTime())) return false;

    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age < 18;
  }, [beneficiary.birthDate]);

  const relationshipOptions = [
    { value: 'CONJUGE', label: 'Cônjuge' }, { value: 'FILHO', label: 'Filho(a)' },
    { value: 'PAI', label: 'Pai' }, { value: 'MAE', label: 'Mãe' },
    { value: 'IRMAO', label: 'Irmão(ã)' }, { value: 'COMPANHEIRO', label: 'Companheiro(a)' },
    { value: 'NETO', label: 'Neto(a)' }, { value: 'AVO', label: 'Avó(ô)' },
    { value: 'TIO', label: 'Tio(a)' }, { value: 'SOBRINHO', label: 'Sobrinho(a)' },
    { value: 'PRIMO', label: 'Primo(a)' }, { value: 'ENTEADO', label: 'Enteado(a)' },
    { value: 'SOCIO', label: 'Sócio(a)' }, { value: 'NENHUM', label: 'Nenhum' },
  ];
  
  return (
    <div className="border rounded-lg p-6 mb-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-primary">Beneficiário {index + 1}</h4>
        {beneficiaries.length > 1 && (
          <Button type="button" variant="ghost" size="icon" onClick={() => removeBeneficiary(beneficiary.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-600 mb-1">Nome completo <span className="text-red-500">*</span></label>
          <Input value={beneficiary.fullName} onChange={e => updateBeneficiary(beneficiary.id, { fullName: e.target.value })} className="h-12" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">CPF <span className="text-red-500">*</span></label>
          <MaskedInput mask="000.000.000-00" value={beneficiary.cpf} onAccept={(value: string) => updateBeneficiary(beneficiary.id, { cpf: value })} className="h-12" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">RG <span className="text-red-500">*</span></label>
          <MaskedInput mask="00.000.000-**" value={beneficiary.rg} onAccept={(value: string) => updateBeneficiary(beneficiary.id, { rg: value })} className="h-12" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Data de nascimento <span className="text-red-500">*</span></label>
          <Input type="date" value={beneficiary.birthDate} onChange={e => updateBeneficiary(beneficiary.id, { birthDate: e.target.value })} className="h-12" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Grau de parentesco <span className="text-red-500">*</span></label>
          <Autocomplete options={relationshipOptions} value={beneficiary.relationship} onChange={v => updateBeneficiary(beneficiary.id, { relationship: v })} placeholder="Selecione..." />
        </div>
      </div>
      
      {isMinor && (
        <div className="mt-6 pt-6 border-t border-dashed">
            <div className="md:col-span-2 flex items-start gap-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm mb-4">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Atenção:</span> Beneficiário é menor de idade. Por favor, preencha os dados do responsável legal.
              </div>
            </div>

            <h5 className="text-md font-semibold text-foreground mb-4">Dados do Responsável Legal</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-600 mb-1">Nome completo <span className="text-red-500">*</span></label>
                    <Input value={beneficiary.legalRepresentative?.fullName} onChange={e => updateBeneficiary(beneficiary.id, { legalRepresentative: { fullName: e.target.value } })} className="h-12" required={isMinor} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">CPF <span className="text-red-500">*</span></label>
                    <MaskedInput mask="000.000.000-00" value={beneficiary.legalRepresentative?.cpf} onAccept={(value: string) => updateBeneficiary(beneficiary.id, { legalRepresentative: { cpf:  value  } })} className="h-12" required={isMinor} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">RG <span className="text-red-500">*</span></label>
                    <MaskedInput mask="00.000.000-**" value={beneficiary.legalRepresentative?.rg} onAccept={(value: string) => updateBeneficiary(beneficiary.id, { legalRepresentative: { rg: value } })} className="h-12" required={isMinor} />
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

// The main component for the entire step
export const Step8 = () => {
  const { fullName, beneficiaries } = useSimulatorStore((state) => state.formData);
  const { addBeneficiary, nextStep, setValidationStatus } = useSimulatorStore((state) => state.actions);
  const beneficiariesError = useSimulatorStore((state) => state.validationStatus.beneficiariesError);
  const firstName = fullName.split(' ')[0] || "";

  const isFormValid = useMemo(() => {
    if (beneficiaries.length === 0) return false;
    return beneficiaries.every(b => {
      const isBeneficiaryValid = b.fullName.trim() && b.cpf.replace(/\D/g, '').length === 11 && b.rg.trim() && b.birthDate && b.relationship;
      
      const birthDateObj = new Date(`${b.birthDate}T00:00:00`);
      if (isNaN(birthDateObj.getTime())) return false;

      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const m = today.getMonth() - birthDateObj.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
          age--;
      }
      const isMinor = age < 18;

     if (isMinor) {
  const rep = b.legalRepresentative;
  return (
    isBeneficiaryValid &&
    !!rep?.fullName?.trim() &&
    (rep?.cpf?.replace(/\D/g, '').length === 11) &&
    !!rep?.rg?.trim()
  );
}
      
      return isBeneficiaryValid;
    });
  }, [beneficiaries]);

  useEffect(() => {
    track('step_view', { step: 8, step_name: 'Beneficiários' });
    setValidationStatus({ beneficiariesError: isFormValid ? null : "Preencha todos os campos obrigatórios de todos os beneficiários." });
  }, [isFormValid, setValidationStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      track('step_complete', { step: 8, step_name: 'Beneficiários', beneficiaries_count: beneficiaries.length });
      nextStep();
    } else {
      setValidationStatus({ beneficiariesError: "Preencha todos os campos obrigatórios de todos os beneficiários." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-2 text-foreground outline-none">
        Para quem vão os benefícios, {firstName}?
      </h3>
      <p className="text-left text-muted-foreground mb-4">Indique pelo menos um beneficiário. É crucial que esses dados estejam corretos para evitar problemas no futuro.</p>
      <p className="text-left text-xs text-muted-foreground italic mb-8">
        <strong>Nota:</strong> Se um beneficiário for menor de 18 anos, é comum indicar um responsável legal ou beneficiário secundário para administrar o valor até a maioridade do beneficiário principal.
      </p>

      {beneficiaries.map((beneficiary, index) => (
        <BeneficiaryForm key={beneficiary.id} beneficiary={beneficiary} index={index} />
      ))}

      <div className="flex justify-end mb-4">
        <Button type="button" variant="outline" onClick={addBeneficiary}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Beneficiário
        </Button>
      </div>

      {beneficiariesError && !isFormValid && <p className="text-sm text-destructive text-center mb-4">{beneficiariesError}</p>}
      
      <NavigationButtons isNextDisabled={!isFormValid} />
    </form>
  );
};