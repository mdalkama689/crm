import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const verifyOtpSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .regex(new RegExp(emailRegex), 'Invalid email format.'),
  otp: z
    .string({ error: 'Otp is required' })
    .length(6, 'Otp must be 6 characters long'),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
