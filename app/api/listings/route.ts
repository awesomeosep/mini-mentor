import { NextResponse } from 'next/server';
import { createServerClientWithCookies } from '@/lib/supabase/server';
import { z } from 'zod';

const AvailabilitySchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  format_note: z.string().optional(),
});

const ListingSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'PAUSED', 'FULL', 'CLOSED']).default('OPEN'),
  end_date: z.string().optional(),
  primary_skill_id: z.string().uuid(),
  availability: z.array(AvailabilitySchema).min(1),
});

export async function POST(req: Request) {
  const supabase = createServerClientWithCookies();
  const body = await req.json();
  const parsed = ListingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const end_date_value = parsed.data.end_date
    ? new Date(parsed.data.end_date + 'T00:00:00Z').toISOString()
    : null;

  const { data: listing, error: listingErr } = await supabase
    .from('mentorship_listing')
    .insert({
      mentor_user_id: user.id,
      name: parsed.data.name,
      description: parsed.data.description,
      status: parsed.data.status,
      end_date: end_date_value,
      primary_skill_id: parsed.data.primary_skill_id,
    })
    .select()
    .single();

  if (listingErr) return NextResponse.json({ error: listingErr.message }, { status: 400 });

  const availabilityRows = parsed.data.availability.map((slot) => ({
    user_id: user.id,
    day_of_week: slot.day_of_week,
    start_time: slot.start_time,
    end_time: slot.end_time,
    format_note: slot.format_note ?? null,
  }));

  const { error: availErr } = await supabase.from('user_availability').insert(availabilityRows);
  if (availErr) return NextResponse.json({ error: availErr.message }, { status: 400 });

  return NextResponse.json({ listing });
}
