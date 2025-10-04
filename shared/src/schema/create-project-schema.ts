import { z } from 'zod';


export const createProjectSchema = z.object({
  name: z.string({ error: 'Project name is required!' }),
  dueDate: z.string().optional(),
  description: z.json().optional(),
  assignToEmployee: z.any(), 
});

export type createProjectInput = z.infer<typeof createProjectSchema>;
