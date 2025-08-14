import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const changeRoleSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .regex(new RegExp(emailRegex), 'Invalid email format.'),
  role:  z.string({ error: "Role is required!"})
});

export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
