import {z} from 'zod'

export const taskSchema = z.object({
    name: z.string({error: "Task name is required!"}),
    dueDate: z.string().optional(),
    description: z.string().optional(),
    attachmentUrl: z.string().optional(), 
    assignedEmployee: z.string().optional(), 
})


export type taskInput = z.infer<typeof taskSchema>
 
