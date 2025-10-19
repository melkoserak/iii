// src/components/simulator/steps/step4/CoverageDetailsSheet.tsx
"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sanitizeHtml } from "@/lib/utils"; // 1. Importe a nova função

interface Props {
  title: string;
  htmlContent: string;
  children: React.ReactNode;
}

export const CoverageDetailsSheet = ({ title, htmlContent, children }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="sr-only">
            Detalhes completos da cobertura {title}.
          </SheetDescription>
        </SheetHeader>
        <div
          className="prose prose-sm max-w-none text-muted-foreground mt-4"
          // 2. Aplique a função de sanitização aqui
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }}
        />
      </SheetContent>
    </Sheet>
  );
};