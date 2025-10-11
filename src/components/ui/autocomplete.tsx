"use client"

import * as React from "react"
import { Check } from "lucide-react"

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
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção...",
  emptyText = "Nenhuma opção encontrada.",
}: AutocompleteProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const selectedLabel = options.find((option) => option.value === value)?.label
    setInputValue(selectedLabel || "")
  }, [value, options])

  return (
    <div className="relative">
      {/* --- INÍCIO DA CORREÇÃO --- */}
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          if (!isOpen) setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder}
        // As classes de 'focus:' foram adicionadas para corresponder aos outros inputs
        className="w-full h-12 px-4 py-3 bg-white border border-border rounded-md transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        autoComplete="off"
      />
      {/* --- FIM DA CORREÇÃO --- */}

      {isOpen && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-white text-card-foreground shadow-md">
          <Command>
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options
                  .filter(option => 
                    removeAccents(option.label.toLowerCase())
                    .includes(removeAccents(inputValue.toLowerCase()))
                  )
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        onChange(option.value)
                        setInputValue(option.label)
                        setIsOpen(false)
                        inputRef.current?.blur()
                      }}
                      className="cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
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
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}