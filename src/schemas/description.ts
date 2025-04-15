import { z } from 'zod';

export const DescriptionSchema = z.object({
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description cannot exceed 500 characters'),
});

export type Description = z.infer<typeof DescriptionSchema>; 