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

    const req = await request.json();
    const user_type = req.user_type;

    if (user_type == 'LEARNER') {
        const { data, error } = await supabase.from('mentorship_match').select('*').eq('learner_id', user.id);
        console.log(error);
        console.log(data); 
        return NextResponse.json(data);
    } 
    else if (user_type == 'MENTOR') {
        const { data, error } = await supabase.from('mentorship_match').select('*').eq('mentor_id', user.id);
        console.log(error);
        console.log(data); 
        return NextResponse.json(data);
    }
}catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};