import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RoleOptions = z.enum(['owner', 'client', 'employee']);

export const changeRoleSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .regex(new RegExp(emailRegex), 'Invalid email format.'),
  role: RoleOptions,
});

export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
