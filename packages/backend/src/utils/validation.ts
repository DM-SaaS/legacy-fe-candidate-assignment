import { z } from 'zod';

export const signatureVerificationSchema = z.object({
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message too long')
    .refine(
      (msg: string) => msg.trim().length > 0,
      'Message cannot be only whitespace'
    ),
  signature: z.string()
    .regex(/^0x[a-fA-F0-9]{130}$/, 'Invalid signature format')
});

export const mfaSetupSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(255, 'Email too long')
});

export const mfaValidateTokenSchema = z.object({
  token: z.string()
    .min(6, 'Token must be 6 digits')
    .max(6, 'Token must be 6 digits')
    .regex(/^\d{6}$/, 'Token must contain only numbers'),
  secret: z.string()
    .min(1, 'Secret is required')
    .max(255, 'Secret too long')
});

export const mfaValidateTokenWithWindowSchema = z.object({
  token: z.string()
    .min(6, 'Token must be 6 digits')
    .max(6, 'Token must be 6 digits')
    .regex(/^\d{6}$/, 'Token must contain only numbers'),
  secret: z.string()
    .min(1, 'Secret is required')
    .max(255, 'Secret too long'),
  windowSize: z.number()
    .int('Window size must be an integer')
    .min(0, 'Window size must be non-negative')
    .max(5, 'Window size too large')
    .optional()
});

export type SignatureVerificationInput = z.infer<typeof signatureVerificationSchema>;
export type MfaSetupInput = z.infer<typeof mfaSetupSchema>;
export type MfaValidateTokenInput = z.infer<typeof mfaValidateTokenSchema>;
export type MfaValidateTokenWithWindowInput = z.infer<typeof mfaValidateTokenWithWindowSchema>; 