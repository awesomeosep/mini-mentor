import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const req = await request.json();
  const mentor_user_id = req.mentor_user_id;
  
  const { data, error } = await supabase.from('mentorship_listing').select('*').eq('mentor_user_id', mentor_user_id);
  console.log(data);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  
  return NextResponse.json(data);
}