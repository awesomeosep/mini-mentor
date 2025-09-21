import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.log(user.id);

    const req = await request.json();
    const listing_id = req.listing_id;
    const mentor_id = req.mentor_id;
    const learner_id = user!.id;
    const learner_availability = req.learner_availability;
    const mentor_availability = req.mentor_availability;

    const match = {
      listing_id: listing_id,
      mentor_id: mentor_id,
      learner_id: learner_id,
      learner_availability: learner_availability,
      mentor_availability: mentor_availability,
      status: 'WAITING_MENTOR',
      start_time: new Date(),
      end_time: null,
    };

    console.log(match)

    const { data, error } = await supabase
      .from('mentorship_match')
      .insert(match)
      .select('*')
      .single();
    console.log(error);
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: learnerData, error: learnerError } = await supabase
      .from('mentorship_match')
      .select('*')
      .eq('learner_id', user.id);

    const { data: mentorData, error: mentorError } = await supabase
      .from('mentorship_match')
      .select('*')
      .eq('mentor_id', user.id);
    if (learnerError) console.log(learnerError);
    if (mentorError) console.log(mentorError);
    let bothData = [];
    if (learnerData === null && mentorData === null) {
      bothData = [];
    } else if (learnerData === null && mentorData !== null) {
      bothData = mentorData!;
    } else if (mentorData === null && learnerData !== null) {
      bothData = learnerData!;
    } else {
      bothData = [...learnerData!, ...mentorData!];
    }

    return NextResponse.json(bothData);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
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

    const { data, error } = await supabase
      .from('mentorship_match')
      .update(match)
      .eq('match_id', matchId)
      .select('*')
      .single();
    console.log(error);
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(JSON.stringify(err), { status: 500 });
  }
}
