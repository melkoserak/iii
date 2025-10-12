import { SimulatorClientPage } from "@/components/simulator/SimulatorClientPage";

// Esta função diz ao Next.js quais páginas estáticas gerar.
// Ela SÓ funciona em Server Components (sem "use client").
export async function generateStaticParams() {
  const steps = ['1', '2', '3']; // Adicione mais números conforme cria mais passos.
  return steps.map((step) => ({
    step: step,
  }));
}

// Este é agora um Server Component. Ele não usa hooks.
// Sua única função é renderizar o componente de cliente, passando os parâmetros.
export default function SimulatorStepPage({ params }: { params: { step: string } }) {
  return <SimulatorClientPage params={params} />;
}