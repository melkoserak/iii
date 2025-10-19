import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ADICIONE ESTA FUNÇÃO
export function formatCurrency(value: number): string {
  if (isNaN(value)) {
    value = 0;
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// ADICIONE ESTA NOVA FUNÇÃO
export function stripHtml(html: string): string {
  if (!html) return "";
  // Usa uma expressão regular para remover as tags HTML e decodifica entidades HTML
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

// ADICIONE ESTA NOVA FUNÇÃO
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Encontra TODOS os elementos dentro do HTML
  doc.body.querySelectorAll('*').forEach((node) => {
    // Remove o atributo 'style' de cada um
    node.removeAttribute('style');
    // Você também pode remover outros atributos indesejados aqui se precisar
    // node.removeAttribute('class');
    // node.removeAttribute('font');
  });

  return doc.body.innerHTML;
}