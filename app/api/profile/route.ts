import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const ProfileSchema = z.object({
  username: z.string().min(3).max(30),
  name: z.string().min(1).max(60),
  timezone: z.string().min(1), // IANA string
  status: z.enum(['TEACHING', 'LEARNING', 'PAUSED', 'MODERATING']),
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
        ...parse.data,
        join_date: new Date().toISOString(),
      },
      { onConflict: 'userid' },
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
