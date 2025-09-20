import { z } from 'zod';

export const ListingCreateSchema = z.object({
  mentor_user_id: z.string().uuid(),
  name: z.string().min(3).max(150),
  description: z.string().max(3000).optional(),
  format_notes: z.string().optional(),
  status: z.enum(['PAUSED', 'FULL', 'OPEN', 'CLOSED']).default('OPEN'),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
});

export type ListingCreate = z.infer<typeof ListingCreateSchema>;

export const AvailabilitySchema = z.object({
  availability_id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  day_of_week: z.number().min(0).max(6),
  start_time: z.string(),
  end_time: z.string(),
  format_note: z.string().optional(),
});
