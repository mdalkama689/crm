import { z} from 'zod'

export const createProjectSchema = z.object({
   name: z.string({error: "Project name is required!"}),
  // iconUrl : z.string().optional(), 
dueDate: z.string().optional(), 
  description: z.string().optional(),
// attachmentUrl: z.string().optional(),
assignToEmployee: z
    .union([z.array(z.string()), z.string()])
    .optional(),
})

export type createProjectInput = z.infer<typeof createProjectSchema>

