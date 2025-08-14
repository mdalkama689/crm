import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string({ error: 'Email is required.' }),
  password: z.string({ error: 'Password is required.' }),
});

export type SignInInputUser = z.infer<typeof signInSchema>;
