import { z } from 'zod';

export const MemorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  timestamp: z.string().min(1, 'Date is required'),
});

export type Memory = z.infer<typeof MemorySchema>; 