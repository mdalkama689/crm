import { z } from 'zod';

const fullnameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmployeeRange = z.enum([
  'RANGE_1_10',
  'RANGE_10_50',
  'RANGE_50_100',
  'RANGE_100_PLUS',
]);

export const signUpSchema = z.object({
  fullname: z
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
});

export const companyDetailsSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .regex(new RegExp(emailRegex), 'Invalid email format.'),
  companyName: z.string().nullable().optional(),
  employeeRange: EmployeeRange.nullable().optional(),
  businessType: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

export type SignUpInputUser = z.infer<typeof signUpSchema>;
export type CompanyDetailsInput = z.infer<typeof companyDetailsSchema>;

const combinedSchema = z.object({
  ...signUpSchema.shape,
  ...companyDetailsSchema.shape,
});

export type UserPayload = z.infer<typeof combinedSchema> & {
  id: string;
  isVerified: boolean;
  role: string;
};
