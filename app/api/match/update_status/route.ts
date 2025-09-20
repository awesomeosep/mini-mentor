import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  try {
    const req = await request.json();
    const matchId = req.matchId;
    const newStatus = req.status;

    const updateStatusRecord = {
      status: newStatus,
      end_date: null,
    };

    if (newStatus === 'PLANNED') {
      updateStatusRecord.end_date = new Date();
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('mentorship_matches')
      .update(updateStatusRecord)
      .eq('id', matchId)
      .select('*')
      .single();
    console.log(error);
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(JSON.stringify(err), { status: 500 });
  }
}
