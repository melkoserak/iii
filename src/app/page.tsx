// src/app/page.tsx
"use client"; // A nossa aplicação é totalmente interativa

import { SimulatorForm } from "@/components/simulator/SimulatorForm";

export default function SimulatorPage() {
  return (
    <main className="flex flex-col items-center w-full p-6 gap-10">
      <header className="w-full max-w-5xl flex items-center">
        <img src="/golden-bear-logo.png" alt="Logo Golden Bear" className="h-4 mr-3" />
        <span className="text-sm text-[#3D3D3D]">Simulador de seguro de vida</span>
      </header>
      <div className="w-full max-w-5xl text-left">
        <h1 className="text-2xl font-medium leading-snug text-foreground">
          Descubra o <span className="font-bold text-primary">plano ideal para você</span><br />
          e envie sua proposta em poucos passos.
        </h1>
      </div>
      <SimulatorForm />
      <footer className="w-full max-w-5xl flex justify-between pt-5 border-t border-border text-sm text-gray-600">
        <p>Esta com duvidas? <a href="/faq" className="font-bold text-primary hover:underline">Leia nosso FAQ</a></p>
        <p>Esta precisando de suporte? <a href="#" className="font-bold text-primary hover:underline">Fale com a gente pelo WhatsApp</a></p>
      </footer>
    </main>
  );
}