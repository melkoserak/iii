// src/components/ui/slider.tsx
"use client"
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    {/* --- INÍCIO DAS ALTERAÇÕES --- */}
    {/* 1. A altura foi alterada de 'h-2' para 'h-1.5' para deixar a linha mais fina. */}
    {/* 2. O fundo foi alterado para a cor exata que você pediu. */}
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-[#ededed]">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    {/* --- FIM DAS ALTERAÇÕES --- */}
    
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full bg-primary shadow-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }