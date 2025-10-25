import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const ListingSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'PAUSED', 'FULL', 'CLOSED']).default('OPEN'),
  end_date: z.string().optional(),
  primary_skill_id: z.string(),
  format_notes: z.string()
});

export async function POST(req: Request) {
  const supabase = await createClient();
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

  const { data: existingSkill, error: skillErr } = await supabase
    .from('skills')
    .select('skill_id')
    .eq('skill_id', parsed.data.primary_skill_id)
    .single();
  if (skillErr || !existingSkill) {
    console.log('skill doesnt exist');

    const { data: newSkill, error: newSkillError } = await supabase
      .from('skills')
      .insert({ name: parsed.data.primary_skill_id })
      .select()
      .single();
    console.log(newSkill, newSkillError);
    if (newSkill && !newSkillError) {
      parsed.data.primary_skill_id = newSkill.skill_id;
    } else {
      parsed.data.primary_skill_id = '';
    }
  }

  const { data: listing, error: listingErr } = await supabase
    .from('mentorship_listing')
    .insert({
      mentor_user_id: user.id,
      name: parsed.data.name,
      description: parsed.data.description,
      status: parsed.data.status,
      end_date: end_date_value,
      primary_skill_id: parsed.data.primary_skill_id,
      format_notes: parsed.data.format_notes
    })
    .select()
    .single();

  if (listingErr) return NextResponse.json({ error: listingErr.message }, { status: 400 });

  return NextResponse.json({ listing });
}
