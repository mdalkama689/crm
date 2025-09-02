import { z } from 'zod';

const fullnameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const employeeSignUpSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .regex(new RegExp(emailRegex), 'Invalid email format.'),
  fullname: z
    .string()
    .min(1, 'Fullname is required')
    .regex(
      new RegExp(fullnameRegex),
      'Fullname must only contain letters and single spaces.',
    ),
  password: z
    .string({ error: 'Password is required.' })
    .min(6, 'Password must be at least 6 characters'),

  token: z.string({ error: 'Token is required.' }),
  tenantId: z.string({ error: 'Tenant id is required!' }),
});

export type employeeSignUpInput = z.infer<typeof employeeSignUpSchema>;
