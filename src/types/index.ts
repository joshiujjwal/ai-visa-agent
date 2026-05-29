// src/types/index.ts — Shared TypeScript types (derived from Zod schemas)
// Add Zod schemas here; types are inferred below each schema.

import { z } from 'zod';

// ---- Application Status ----

export const ApplicationStatusSchema = z.enum([
  'draft',
  'documents_pending',
  'submitted',
  'under_review',
  'approved',
  'rejected',
]);

export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

// ---- Visa Types ----

export const VisaTypeSchema = z.enum([
  'tourist',
  'student',
  'work',
  'family',
  'transit',
  'business',
  'medical',
]);

export type VisaType = z.infer<typeof VisaTypeSchema>;

// ---- API Request Schemas ----

export const CreateApplicationSchema = z.object({
  destination_country: z.string().length(2).toUpperCase(),
  visa_type: VisaTypeSchema,
  applicant_nationality: z.string().length(2).toUpperCase(),
  travel_date: z.string().datetime().optional(),
});

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;

export const ChatMessageSchema = z.object({
  application_id: z.string().uuid(),
  message: z.string().min(1).max(2000),
});

export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;

export const UpdateStatusSchema = z.object({
  status: ApplicationStatusSchema,
});

export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;

// ---- Auth Schemas ----

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72), // bcrypt max is 72 chars
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = RegisterSchema;
export type LoginInput = z.infer<typeof LoginSchema>;
