import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

// Carrega a fonte Noto Sans do Google Fonts para usar no projeto
const noto = Noto_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Simulador de Seguro de Vida",
  description: "Simulador de seguro de vida MAG para militares",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      {/*
        A classe bg-[#F0F2F5] aplica o fundo cinza claro que você tinha.
        A fonte Noto Sans é aplicada a toda a página.
      */}
      <body className={`${noto.className} bg-[#F0F2F5] min-h-screen`}>
        {/* O 'children' aqui será o conteúdo da nossa página principal (page.tsx) */}
        {children}
      </body>
    </html>
  );
}