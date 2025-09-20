import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  try {
    const req = await request.json();
    const username = req.username;
    const name = req.name;
    const email = req.email;

    const user = {
      username: username,
      email: email,
      name: name,
      status: "LEARNING",
      join_date: new Date(),
      ban_date: null,
      ban_reason: '',
    };

    const supabase = await createClient();
    const { data, error } = await supabase.from('users').insert(user).select('*').single();
    console.log(error);
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(JSON.stringify(err), { status: 500 });
  }
}
