import { z } from 'zod';

const EmployeeRange = z.enum([
  'RANGE_1_10',
  'RANGE_10_50',
  'RANGE_50_100',
  'RANGE_100_PLUS',
]);

export const tenantSchema = z.object({
  name: z.string({ error: 'Compmany name is required!' }),
  employeeRange: EmployeeRange.nullable().optional(),
  businessType: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

export type TenantInput = z.infer<typeof tenantSchema>;
