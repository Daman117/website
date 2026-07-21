import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Standard Tailwind class combiner: merges conditional classes and resolves
// conflicting utilities (last one wins). Standard shadcn helper.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
