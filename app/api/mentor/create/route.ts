import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  try {
    const req = await request.json();
    const userId = req.userId;
    const username = req.username;
    const name = req.name;
    const status = req.status;

    const user = {
        userid: userId,
        username: username,
        name: name,
        status: status,
        join_date: new Date(),
        ban_date: null,
        ban_reason: ""
    }


    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profile')
      .insert(user)
      .select('*')
      .single();
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);
    }
    catch (err) {
        return NextResponse.json(JSON.stringify(err), { "status": 500 });
    }
}
// app/api/listings/route.ts
// import { NextResponse } from 'next/server';
// import { supabaseAdmin } from '@/lib/supabaseServer';
// import { ListingCreateSchema } from '@/lib/validation';
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const parse = ListingCreateSchema.safeParse(body);
//     if (!parse.success) {
//       return NextResponse.json({ error: parse.error.errors }, { status: 400 });
//     }
//     const listing = {
//       ...parse.data,
//       // ensure creation_date is server time
//       creation_date: new Date().toISOString(),
//     };
//     const { data, error } = await supabaseAdmin
//       .from('mentorship_listing')
//       .insert(listing)
//       .select('*')
//       .single();
//     if (error) return NextResponse.json({ error }, { status: 500 });
//     return NextResponse.json(data);
//   } catch (err) {
//     return NextResponse.json({ error: String(err) }, { status: 500 });
//   }
// }
// export async function GET(req: Request) {
//   // implement search using query params, e.g. ?q=python&online=true&day=1
//   const url = new URL(req.url);
//   const q = url.searchParams.get('q') || '';
//   const online = url.searchParams.get('online');
//   const day = url.searchParams.get('day'); // 0-6
//   let query = supabaseAdmin.from('mentorship_listing').select('*, mentor:user_id(*)');
//   if (q) {
//     // simple text search on name/description
//     query = query.ilike('name', `%${q}%`).or(`description.ilike.%${q}%`);
//   }
//   if (online === 'true') {
//     query = query.eq('format_notes', 'online').or('format_notes.ilike.%online%');
//   }
//   const { data, error } = await query.limit(50);
//   if (error) return NextResponse.json({ error }, { status: 500 });
//   return NextResponse.json(data);
// }





