import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
        data: {user},
        error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.log(user.id);

    const req = await request.json();
    const newStatus = req.newStatus;
    const matchId = req.matchId;

    const match = {
      status: newStatus,
    };

    const { data, error } = await supabase.from('mentorship_match').update(match).eq('match_id', matchId).select('*').single();
    console.log(error);
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(JSON.stringify(err), { status: 500 });
  }
}