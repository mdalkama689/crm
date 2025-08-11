import {z} from 'zod'

// fullname: string, password: string, token : string, email: string


const fullnameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const employeeSignUpSchema = z.object({fullname: z
    .string()
    .min(1, 'Fullname is required')
    .regex(
      new RegExp(fullnameRegex),
      'Fullname must only contain letters and single spaces.',
    ),
  email: z
    .string({ error: 'Email is required' })
    .regex(new RegExp(emailRegex), 'Invalid email format.'),
  password: z
    .string({ error: 'Password is required.' })
    .min(6, 'Password must be at least 6 characters'),

    token: z.string({error: 'Password is required.'}) 
}) 

 


export type employeeSignUpInput = z.infer<typeof employeeSignUpSchema>