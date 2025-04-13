import { z } from 'zod';

export const MemorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string()
    .min(1, 'Description is required')
    .max(700, 'Description cannot exceed 700 characters'),
  timestamp: z.string().min(1, 'Date is required'),
  image: z.string().min(1, 'Image is required'),
});

export type Memory = z.infer<typeof MemorySchema>; 