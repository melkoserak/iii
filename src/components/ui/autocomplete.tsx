"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce" // Importe o hook

import { cn, removeAccents } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"

export type AutocompleteOption = {
  value: string
  label: string
}

type AutocompleteProps = {
  options: AutocompleteOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string;
  isLoading?: boolean;
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção...",
  emptyText = "Nenhuma opção encontrada.",
  className,
  isLoading = false,
}: AutocompleteProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // --- CORREÇÃO APLICADA AQUI ---
  // Atraso ajustado para 300ms para uma experiência fluida
  const debouncedInputValue = useDebounce(inputValue, 300);

  React.useEffect(() => {
    const selectedLabel = options.find((option) => option.value === value)?.label
    setInputValue(selectedLabel || "")
  }, [value, options])

  const filteredOptions = React.useMemo(() => {
    // A filtragem agora usa o valor "atrasado"
    const normalizedInput = removeAccents(debouncedInputValue.toLowerCase());
    return options.filter(option => 
      removeAccents(option.label.toLowerCase()).includes(normalizedInput)
    );
  }, [debouncedInputValue, options]);

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        value={inputValue} // O input SEMPRE usa o valor instantâneo
        onChange={(e) => {
          setInputValue(e.target.value)
          if (!isOpen) setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder}
        className={cn("h-12 px-4 py-3", className)}
        autoComplete="off"
        disabled={isLoading}
      />

      {isOpen && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-white text-card-foreground shadow-md">
          <Command>
            <CommandList>
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Carregando...</div>
              ) : (
                <>
                  <CommandEmpty>{emptyText}</CommandEmpty>
                  <CommandGroup>
                    {filteredOptions.map((option, index) => (
                      <CommandItem
                        key={`${option.value}-${index}`}
                        onSelect={() => {
                          onChange(option.value)
                          setInputValue(option.label)
                          setIsOpen(false)
                          inputRef.current?.blur()
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}