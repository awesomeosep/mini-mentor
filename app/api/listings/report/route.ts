import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.log(user.id);

    const req = await request.json();
    const submitter_id = user!.id;
    const listing_id = req.listing_id;
    const thread_type = req.thread_type;
    // const thread_id = req.thread_id;
    // const submitted_time = req.submitted_time;
    const report_reason_class = req.report_reason_class;
    const report_reason_text = req.report_reason_text;

    const report = {
      submitter_id: submitter_id,
      thread_type: thread_type,
      thread_id: listing_id,
      submitted_time: new Date(),
      report_reason_class: report_reason_class,
      report_reason_text: report_reason_text, 
    };

    const { data, error } = await supabase
      .from('safety_report')
      .insert(report)
      .select('*')
      .single();
    console.log(error);
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
};