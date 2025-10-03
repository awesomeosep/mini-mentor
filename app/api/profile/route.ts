import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const AvailabilitySchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  format_note: z.string().optional(),
});

const ProfileSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(2),
  timezone: z.string().min(2),
  status: z.enum(['TEACHING', 'PAUSED', 'LEARNING', 'MODERATING']).default('LEARNING'),
  availability: z.array(AvailabilitySchema).optional(),
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase.from('users').select('*').eq('userid', user.id).single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const parse = ProfileSchema.safeParse(body);
  if (!parse.success) return NextResponse.json({ error: parse.error.format() }, { status: 400 });

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        userid: user.id,
        name: parse.data.name,
        username: parse.data.username,
        timezone: parse.data.timezone,
        status: parse.data.status,
        join_date: new Date().toISOString(),
      },
      { onConflict: 'userid' },
    )
    .select()
    .single();

  if (parse.data.availability && parse.data.availability.length > 0) {
    const availabilityRows = parse.data.availability.map((slot) => ({
      user_id: user.id,
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      format_note: slot.format_note ?? null,
    }));

    await supabase.from('user_availability').delete().eq('user_id', user.id);
    const { error: availErr } = await supabase.from('user_availability').insert(availabilityRows);
    if (availErr) return NextResponse.json({ error: availErr.message }, { status: 400 });
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
