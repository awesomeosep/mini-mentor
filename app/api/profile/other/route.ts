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
  const userid = req.userid;
  
  const { data, error } = await supabase.from('users').select('*').eq('userid', userid);
  console.log(data);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  
  return NextResponse.json(data);
}