"use client"; 

import { SimulatorForm } from "@/components/simulator/SimulatorForm";
import Image from 'next/image'; // 1. Importe o componente Image

// ✅ ADICIONE ESTA LINHA TAMBÉM
export const dynamic = 'force-static';

export default function SimulatorPage() {
  return (
    <main className="flex flex-col items-center w-full p-6 gap-10">
      <header className="w-full max-w-5xl flex items-center">
        {/* 2. Substitua <img> por <Image /> */}
        <Image 
          src="/logo-golden-bear.png"
          alt="Logo Golden Bear" 
          width={56} 
          height={16} 
          className="h-4 w-auto mr-3" 
        />
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