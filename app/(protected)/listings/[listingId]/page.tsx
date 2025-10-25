'use client';

import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import ApplyButton from '@/components/ApplyButton';
import { useEffect, useState } from 'react';

type Availability = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  format_note: string | null;
  availability_id: string;
};

type Skill = { skill_id: string; name: string };

type Listing = {
  listing_id: string;
  name: string;
  description?: string;
  status: string;
  end_date?: string;
  users: { userid: string; name: string; username: string }[];
  primary_skill_id: Skill;
  skills: Skill[];
  mentor_user_id: string;
};

type UserData = {
  userid: string;
  username?: string | null;
  name?: string | null;
  timezone?: string | null;
  join_date?: string | null;
  ban_date?: string | null;
  ban_reason?: string | null;
  status?: string | null;
  email?: string | null;
};

type Props = { params: Promise<{ listingId: string }> };

export default function ListingPage({ params }: Props) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [primarySkill, setPrimarySkill] = useState<Skill | null>(null);
  const [mentorInfo, setMentorInfo] = useState<UserData | null>(null);
  const [mentorAvailability, setMentorAvailability] = useState<Availability[] | null>(null);
  const [learnerAvailability, setLearnerAvailability] = useState<Availability[] | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoadingInfo(true);
      const supabase = await createClient();

      const { data: listing2, error } = await supabase
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
      setListing(listing2);

      console.log(listing, error);

      if (listing2) {
        const { data: mentorAvailability2 } = await supabase
          .from('user_availability')
          .select('*')
          .eq('user_id', listing2.mentor_user_id);
        setMentorAvailability(mentorAvailability2);

        console.log("mentor avail", listing2.mentor_user_id, mentorAvailability);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data: mentorInfo2 } = await supabase
          .from('users')
          .select('*')
          .eq('userid', listing2.mentor_user_id)
          .single();
        setMentorInfo(mentorInfo2);

        const { data: learnerAvailability2 } = await supabase
          .from('user_availability')
          .select('*')
          .eq('user_id', user?.id)
          .single();
        setLearnerAvailability(learnerAvailability2);

        const { data: primarySkill2 } = await supabase
          .from('skills')
          .select('*')
          .eq('skill_id', listing2.primary_skill_id)
          .single();
        setPrimarySkill(primarySkill2);
        setLoadingInfo(false);
      }
    }
    fetchData();
  }, []);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return loadingInfo ? (
    <div>
      <p>Loading listing...</p>
    </div>
  ) : listing ? (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <h1 className="text-3xl font-bold">{listing?.name}</h1>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">{listing?.description}</p>
        <span className="rounded bg-red-600 px-2 py-1 text-sm font-medium">{listing.status}</span>
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
              <span className="font-medium">Name:</span> {mentorInfo?.name}
            </p>
            <p>
              <span className="font-medium">Username:</span>{' '}
              <Link
                href={`/profile/${mentorInfo?.userid}`}
                className="text-blue-600 hover:underline"
              >
                @{mentorInfo?.username}
              </Link>
            </p>
          </div>
        )}
      </section>
      <section className="border-t pt-4">
        <h2 className="mb-2 text-xl font-semibold">Mentor Availability</h2>
        {mentorAvailability && mentorAvailability.length > 0 ? (
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
        learnerAvailability={learnerAvailability && learnerAvailability.length > 0 ?  learnerAvailability[0].availability_id : ''}
        mentorAvailability={mentorAvailability && mentorAvailability.length > 0 ? mentorAvailability[0].availability_id : ''}
      />{' '}
    </div>
  ) : (
    <div>
      <p>Listing not found</p>
    </div>
  );
}
