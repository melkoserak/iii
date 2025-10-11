"use client";
import { NavigationButtons } from '../NavigationButtons';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
// A importação do 'shallow' foi removida

export const Step1 = () => {
  // --- INÍCIO DA CORREÇÃO DEFINITIVA ---
  // Selecionamos os dados e as ações em chamadas separadas.
  const fullName = useSimulatorStore((state) => state.formData.fullName);
  const { setFormData, nextStep } = useSimulatorStore((state) => state.actions);
  // --- FIM DA CORREÇÃO ---

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim()) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 className="text-2xl font-medium text-center mb-8 text-foreground">Primeiramente, nos diga seu nome completo</h3>
      <div>
        <label htmlFor="fullName" className="block text-sm font-bold text-gray-600 mb-1">
          Nome completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={fullName}
          onChange={(e) => setFormData({ fullName: e.target.value })}
          className="w-full h-12 px-4 py-3 bg-white border border-border rounded-md transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Seu nome completo"
          required
        />
      </div>
      <NavigationButtons isNextDisabled={!fullName.trim()} />
    </form>
  );
};