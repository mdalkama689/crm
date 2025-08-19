import { z} from 'zod'

export const createProjectSchema = z.object({
   name: z.string().min(1, "Project name is required!"),
  icon: z.string().min(1, "Icon is required!"),
dueDate: z.string().optional(), 
  description: z.string().optional(),
attachment: z.string().optional(),
assignToEmployee: z.array(z.string())
})

export type createProjectInput = z.infer<typeof createProjectSchema>

