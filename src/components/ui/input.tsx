import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // --- INÍCIO DA CORREÇÃO ---
          // Classes base para todos os inputs
          "flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm",
          "placeholder:text-muted-foreground",
          // Estilo de foco que imita o frontend.css (borda azul + sombra azul clara)
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          // Estilos para desabilitado
          "disabled:cursor-not-allowed disabled:opacity-50",
          // --- FIM DA CORREÇÃO ---
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }