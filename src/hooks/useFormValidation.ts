import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Common validation schemas with improved security
export const emailSchema = z
  .string()
  .min(1, 'E-mail é obrigatório')
  .email('E-mail inválido')
  .max(255, 'E-mail muito longo')
  .transform(val => val.toLowerCase().trim());

// Strong password validation (8+ characters, uppercase, lowercase, number, special char)
export const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .max(128, 'A senha deve ter no máximo 128 caracteres')
  .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Deve conter pelo menos um número')
  .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Deve conter pelo menos um caractere especial');

// Simplified password for login (no requirements, just check if provided)
export const loginPasswordSchema = z
  .string()
  .min(1, 'Senha é obrigatória');

// Mozambique phone number validation (more flexible)
export const phoneSchema = z
  .string()
  .regex(/^(\+?258)?[8][2-7]\d{7}$/, 'Número de telefone inválido (ex: +258 82 123 4567)')
  .transform(val => val.replace(/\s/g, ''));

// Name validation (sanitized)
export const nameSchema = z
  .string()
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(100, 'Nome muito longo')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos')
  .transform(val => val.trim());

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export const gsmLoginSchema = z.object({
  email: emailSchema,
  whatsapp: phoneSchema,
  password: passwordSchema,
});

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  message: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(2000, 'Mensagem muito longa')
    .transform(val => val.trim()),
});

// Registration schema with strong password
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type GsmLoginFormData = z.infer<typeof gsmLoginSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;

// Custom hook for form validation
export const useValidatedForm = <T extends z.ZodSchema>(
  schema: T,
  defaultValues?: Partial<z.infer<T>>
) => {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as z.infer<T>,
    mode: 'onChange',
  });
};