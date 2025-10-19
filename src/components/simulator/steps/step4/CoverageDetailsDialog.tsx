// src/components/simulator/steps/step4/CoverageDetailsDialog.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // 1. Importe o componente Description
} from "@/components/ui/dialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  htmlContent: string;
}

export const CoverageDetailsDialog = ({ isOpen, onClose, title, htmlContent }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {/* 2. Adicione a descrição para acessibilidade */}
          <DialogDescription className="sr-only">
            Detalhes completos da cobertura {title}.
          </DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </DialogContent>
    </Dialog>
  );
};