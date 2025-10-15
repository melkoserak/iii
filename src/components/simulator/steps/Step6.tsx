// src/components/simulator/steps/Step6.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { IMaskMixin } from 'react-imask';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { NavigationButtons } from '../NavigationButtons';
import { Input } from '@/components/ui/input';
import { track } from '@/lib/tracking';
import { getAddressByZipCode } from '@/services/apiService';
import { Loader2 } from 'lucide-react';

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

export const Step6 = () => {
  const { formData, validationStatus } = useSimulatorStore();
  const { setFormData, setValidationStatus, nextStep } = useSimulatorStore((state) => state.actions);
  const firstName = formData.fullName.split(' ')[0] || "";
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  useEffect(() => {
    track('step_view', { step: 6, step_name: 'Endereço' });
  }, []);

  useEffect(() => {
    const cleanedZip = formData.zipCode.replace(/\D/g, '');
    if (cleanedZip.length === 8) {
      const fetchAddress = async () => {
        setIsFetchingAddress(true);
        try {
          const address = await getAddressByZipCode(cleanedZip);
          setFormData({
            street: address.logradouro,
            neighborhood: address.bairro,
            city: address.localidade,
            state: address.uf,
          });
        } catch (error) {
          console.error(error);
          setFormData({ street: '', neighborhood: '', city: '', state: '' });
        } finally {
          setIsFetchingAddress(false);
        }
      };
      fetchAddress();
    }
  }, [formData.zipCode, setFormData]);

  useEffect(() => {
    setValidationStatus({
      zipCodeError: formData.zipCode.replace(/\D/g, '').length === 8 ? null : 'CEP inválido.',
      streetError: formData.street.trim() ? null : 'Campo obrigatório.',
      numberError: formData.number.trim() ? null : 'Campo obrigatório.',
      neighborhoodError: formData.neighborhood.trim() ? null : 'Campo obrigatório.',
      cityError: formData.city.trim() ? null : 'Campo obrigatório.',
    });
  }, [formData.zipCode, formData.street, formData.number, formData.neighborhood, formData.city, setValidationStatus]);

  const isFormValid = !validationStatus.zipCodeError && !validationStatus.streetError && !validationStatus.numberError && !validationStatus.neighborhoodError && !validationStatus.cityError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      track('step_complete', { step: 6, step_name: 'Endereço' });
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-8 text-foreground outline-none">
        {firstName}, agora complete o seu endereço:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 relative">
          <label htmlFor="zipCode" className="block text-sm font-bold text-gray-600 mb-1">CEP <span className="text-red-500">*</span></label>
          <MaskedInput mask="00000-000" id="zipCode" value={formData.zipCode} onAccept={(value: string) => setFormData({ zipCode: value })} className="h-12" required />
          {isFetchingAddress && <Loader2 className="absolute right-3 top-9 h-5 w-5 animate-spin text-muted-foreground" />}
        </div>
        <div className="md:col-span-3">
          <label htmlFor="street" className="block text-sm font-bold text-gray-600 mb-1">Logradouro <span className="text-red-500">*</span></label>
          <Input id="street" value={formData.street} onChange={(e) => setFormData({ street: e.target.value })} className="h-12" required disabled={isFetchingAddress} />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="number" className="block text-sm font-bold text-gray-600 mb-1">Número <span className="text-red-500">*</span></label>
          <Input id="number" value={formData.number} onChange={(e) => setFormData({ number: e.target.value })} className="h-12" required />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="complement" className="block text-sm font-bold text-gray-600 mb-1">Complemento</label>
          <Input id="complement" value={formData.complement} onChange={(e) => setFormData({ complement: e.target.value })} className="h-12" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="neighborhood" className="block text-sm font-bold text-gray-600 mb-1">Bairro <span className="text-red-500">*</span></label>
          <Input id="neighborhood" value={formData.neighborhood} onChange={(e) => setFormData({ neighborhood: e.target.value })} className="h-12" required disabled={isFetchingAddress} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="city" className="block text-sm font-bold text-gray-600 mb-1">Cidade <span className="text-red-500">*</span></label>
          <Input id="city" value={formData.city} onChange={(e) => setFormData({ city: e.target.value })} className="h-12" required disabled={isFetchingAddress} />
        </div>
      </div>
      <NavigationButtons isNextDisabled={!isFormValid} />
    </form>
  );
};