import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    query,
    status,
    skill_id,
    matchAvailability = false,
    limit = 20,
    offset = 0,
  } = await req.json();

  let q = supabase.from('mentorship_listing').select(
    `
        listing_id,
        name,
        description,
        status,
        primary_skill_id,
        mentor_user_id,
        creation_date,
        end_date
      `,
  );

  if (status && status !== 'all') q = q.eq('status', status);
  if (skill_id) q = q.eq('primary_skill_id', skill_id);
  if (query?.trim()) {
    const like = `%${query.trim()}%`;
    q = q.or(`name.ilike.${like},description.ilike.${like}`);
  }

  if (matchAvailability) {
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: myAvail, error: myErr } = await supabase
      .from('user_availability')
      .select('day_of_week,start_time,end_time')
      .eq('user_id', user.id);

    if (myErr) return NextResponse.json({ error: myErr.message }, { status: 400 });

    if (!myAvail || myAvail.length === 0) {
      return NextResponse.json({ listings: [], count: 0 });
    }

    const { data: listings, error: baseErr } = await q;
    if (baseErr) return NextResponse.json({ error: baseErr.message }, { status: 400 });

    if (!listings || listings.length === 0) {
      return NextResponse.json({ listings: [] });
    }

    const mentorIds = [...new Set(listings.map((l) => l.mentor_user_id).filter(Boolean))];

    if (mentorIds.length === 0) {
      return NextResponse.json({ listings: [] });
    }

    const { data: mentorAvail, error: mentorErr } = await supabase
      .from('user_availability')
      .select('user_id,day_of_week,start_time,end_time')
      .in('user_id', mentorIds);
    if (mentorErr) return NextResponse.json({ error: mentorErr.message }, { status: 400 });

    const overlaps = (r: any, m: any) =>
      r.day_of_week === m.day_of_week && r.start_time <= m.end_time && r.end_time >= m.start_time;

    const filtered = listings.filter((l) =>
      mentorAvail
        .filter((m) => m.user_id === l.mentor_user_id)
        .some((mSlot) => myAvail.some((rSlot) => overlaps(rSlot, mSlot))),
    );

    const paged = filtered.slice(offset, offset + limit);
    return NextResponse.json({ listings: paged });
  }

  q = q.range(offset, offset + limit - 1);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ listings: data });
}
