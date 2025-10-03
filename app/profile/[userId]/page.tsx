'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Props {
  params: Promise<{ userId: string }>;
}

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

type SupabaseUserLike = {
  id?: string;
  email?: string | null;
  user_metadata?: { username?: string; name?: string } | null;
};

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function safeStr(v: unknown) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  try {
    return String(v);
  } catch {
    return '';
  }
}

export default function ProfilePage({ params }: Props) {
  const [data, setData] = useState<UserData | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const [listingsForMatches, setListingsForMatches] = useState<Array<any>>([]);
  const [learnerNamesForLearners, setLearnerNamesForLearners] = useState<Array<any>>([]);
  const [mentorNamesForMentors, setMentorNamesForMentors] = useState<Array<any>>([]);
  const [listings, setListings] = useState<Array<{
    listing_id: string;
    name: string;
    description?: string | null;
    status: string;
    mentor_user_id: string;
    format_notes: string;
  }> | null>(null);
  const [matches, setMatches] = useState<Array<{
    match_id: string;
    listing_id: string;
    mentor_id: string;
    learner_id: string;
    status: string;
    start_time?: string | null;
    end_time?: string | null;
  }> | null>(null);
  const [myUser, setMyUser] = useState<any>(null);

  const [loadingListings, setLoadingListings] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    (async () => {
      const supabase = await createClient();
      try {
        supabase.auth.getUser().then(async ({ data: { user } }) => {
          setMyUser(user);
          // if (user.id == (await params).userId) {
          //   router.push('/profile/new');
          // }
        });
        const res = await fetch('/api/profile/other', {
          method: 'POST',
          body: JSON.stringify({ userid: (await params).userId }),
        });
        const profileData = await res.json();
        console.log('profile', profileData);
        setData(profileData[0] as UserData);
      } catch (err) {
        if (mounted) setError(err);
        console.error(err);
      }

      // fetch listings
      setLoadingListings(true);
      setLoadingMatches(true);
      const res = await fetch('/api/profile/listings', {
        method: 'POST',
        body: JSON.stringify({ mentor_user_id: (await params).userId }),
      });
      const listingsData = await res.json();
      setListings(listingsData);
      setLoadingListings(false);
      if (mounted) setListings(listingsData);

      console.log('is this working');
      const {
        data: { user: myUser1 },
      } = await supabase.auth.getUser();
      // fetch matches where this user is mentor

      console.log(myUser1, (await params).userId);

      try {
        const resM = await fetch('/api/match', {
          method: 'GET',
        });
        const matchesData = await resM.json();
        console.log('matchesdata', matchesData);
        // fetch all listings for matches in matchesData
        const listingIds = matchesData.map((m: any) => m.listing_id);
        const { data: listingsForMatchesData, error: listingsError } = await supabase
          .from('mentorship_listing')
          .select('*')
          .in('listing_id', listingIds);
        console.log('formatches', listingsForMatchesData, listingsError);

        setListingsForMatches(listingsForMatchesData ?? []);

        const { data: learnerNamesForLearners, error: learnersError } = await supabase
          .from('users')
          .select('*')
          .in(
            'userid',
            matchesData.map((m: any) => m.learner_id),
          );
        const { data: mentorNamesForMentors, error: mentorsError } = await supabase
          .from('users')
          .select('*')
          .in('userid', matchesData.map((m: any) => m.mentor_id).flat());
        console.log('formentors', mentorNamesForMentors, mentorsError);

        console.log('forlearners', learnerNamesForLearners, learnersError);
        setLearnerNamesForLearners(learnerNamesForLearners ?? []);
        setMentorNamesForMentors(mentorNamesForMentors ?? []);

        setListingsForMatches(listingsForMatchesData ?? []);
        console.log({ listingsForMatches });

        setMatches(matchesData);
        setLoadingMatches(false);
      } catch (err) {
        setLoadingMatches(false);
        console.error('failed to load matches', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [params]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <Card>
          <CardContent>
            <p className="text-red-600">Failed to load profile: {safeStr(error)}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <Card>
          <CardContent>
            <p>User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>
                {(safeStr(data?.name) || 'U').slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{safeStr(data?.name)}</CardTitle>
              <CardDescription className="mt-1">@{safeStr(data?.username)}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Timezone</h4>
              <p className="mt-1">{safeStr(data?.timezone) || 'EST'}</p>
              <h4 className="mt-4 text-sm font-medium text-muted-foreground">Status</h4>
              <p className="mt-1">{data.status == 'LEARNING' ? 'Learner' : 'Mentor'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Joined</h4>
              <p className="mt-1">{formatDate(safeStr(data?.join_date) || undefined)}</p>
              <h4 className="mt-4 text-sm font-medium text-muted-foreground">Contact Info</h4>
              <p className="mt-1">{safeStr(data?.email) || '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Listings section */}
      <div className="mt-6">
        <h3 className="mb-3 text-lg font-semibold">Listings</h3>
        {loadingListings && <p>Loading listings…</p>}
        {/* listings errors are currently shown in console; implement UI if needed */}
        {!loadingListings && listings && listings.length === 0 && <p>No listings found</p>}
        <div className="space-y-3">
          {listings &&
            listings.map((l) => (
              <Card key={l.listing_id}>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="text-sm font-semibold">{l.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {l.description || 'No description'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {'Format notes: ' + (l.format_notes || 'None')}
                      </div>
                    </div>
                    <div className="ml-4 flex flex-shrink-0 flex-row gap-4 p-4">
                      <div className="flex items-center rounded-full bg-muted px-2 py-1 text-xs">
                        <p>{l.status}</p>
                      </div>
                      {myUser?.id !== l.mentor_user_id && (
                        <Button
                          onClick={() => {
                            fetch('/api/match/', {
                              method: 'POST',
                              body: JSON.stringify({
                                listing_id: l.listing_id,
                                mentor_id: l.mentor_user_id,
                                learner_availability: null,
                                mentor_availability: null,
                              }),
                            });
                          }}
                        >
                          Request
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="mb-3 text-lg font-semibold">Matches </h3>
        {(!matches || matches.length == 0) && !loadingMatches && <p>No matches found</p>}
        {loadingMatches && <p>Loading matches…</p>}
        <div className="space-y-3">
          {matches &&
            matches.length > 0 &&
            matches.map((m) => (
              <Card key={m.match_id}>
                <CardContent>
                  <div className="flex min-h-20 items-center justify-between">
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="text-sm font-semibold">
                        Listing Name:{' '}
                        {listingsForMatches.find((l) => l.listing_id == m.listing_id)?.name}
                      </div>
                      {m.mentor_id == myUser?.id ? (
                        <div className="text-sm text-muted-foreground">
                          Mentee:{' '}
                          {learnerNamesForLearners.find((l) => l.userid == m.learner_id)?.name}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Mentor: {mentorNamesForMentors.find((l) => l.userid == m.mentor_id)?.name}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="flex items-center rounded-full bg-muted px-2 py-1 text-xs">
                        <p>{m.status}</p>
                      </div>
                    </div>
                  </div>
                  {m.status === 'WAITING_MENTOR' && m.mentor_id == myUser?.id && (
                    <Button
                      className="ml-2"
                      onClick={() => {
                        console.log(m.match_id);
                        fetch('/api/match/', {
                          method: 'PUT',
                          body: JSON.stringify({
                            matchId: m.match_id,
                            newStatus: 'PLANNED',
                          }),
                        });
                      }}
                    >
                      Accept Request
                    </Button>
                  )}
                  {m.learner_id == myUser?.id && m.status === 'PLANNED' && (
                    <div>
                      <p>Mentorship confirmed!</p>{' '}
                      <p>
                        {learnerNamesForLearners.find((l) => l.id == m.mentor_id)?.username +
                          "'s email: "}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
