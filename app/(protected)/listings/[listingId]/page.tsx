import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import ApplyButton from '@/components/ApplyButton';

type Availability = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  format_note: string | null;
};

type Props = { params: Promise<{ listingId: string }> };

export default async function ListingPage({ params }: Props) {
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from('mentorship_listing')
    .select(
      `
      listing_id,
      name,
      description,
      status,
      primary_skill_id,
      mentor_user_id,
      skills:primary_skill_id (
        skill_id,
        name
      ),
      users:mentor_user_id (
        userid,
        username,
        name
      )
    `,
    )
    .eq('listing_id', (await params).listingId)
    .single();

  console.log(listing, error);

  if (error || !listing) {
    return <div className="p-8">Listing not found.</div>;
  }

  const { data: mentorAvailability } = await supabase
    .from('user_availability')
    .select('*')
    .eq('user_id', listing.mentor_user_id)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: learnerAvailability } = await supabase
    .from('user_availability')
    .select('*')
    .eq('user_id', user?.id)
    .single();

  const { data: primarySkill } = await supabase
    .from('skills')
    .select('*')
    .eq('skill_id', listing.primary_skill_id)
    .single();

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <h1 className="text-3xl font-bold">{listing.name}</h1>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">{listing.description}</p>
        <span className="rounded bg-gray-200 px-2 py-1 text-sm font-medium">{listing.status}</span>
      </div>
      {listing.skills && (
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium">Primary Skill:</span> {primarySkill?.name || 'N/A'}
        </p>
      )}
      <section className="border-t pt-4">
        <h2 className="mb-2 text-xl font-semibold">Mentor</h2>
        {listing.users && (
          <div className="space-y-1">
            <p>
              <span className="font-medium">Name:</span> {listing.users[0].name}
            </p>
            <p>
              <span className="font-medium">Username:</span>{' '}
              <Link
                href={`/profile/${listing.users[0].userid}`}
                className="text-blue-600 hover:underline"
              >
                @{listing.users[0].username}
              </Link>
            </p>
          </div>
        )}
      </section>
      <section className="border-t pt-4">
        <h2 className="mb-2 text-xl font-semibold">Mentor Availability</h2>
        {mentorAvailability?.length ? (
          <ul className="space-y-2">
            {mentorAvailability.map((slot: Availability) => (
              <li key={slot.day_of_week + slot.start_time} className="rounded border p-3">
                <p className="font-medium">
                  {dayNames[slot.day_of_week]} {slot.start_time.slice(0, 5)}–
                  {slot.end_time.slice(0, 5)}
                </p>
                {slot.format_note && (
                  <p className="text-sm text-muted-foreground">{slot.format_note}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No availability posted.</p>
        )}
      </section>
      <ApplyButton
        listingId={listing.listing_id}
        mentorId={listing.mentor_user_id}
        learnerAvailability={learnerAvailability?.availablility_id}
        mentorAvailability={mentorAvailability?.availability_id}
      />{' '}
    </div>
  );
}
