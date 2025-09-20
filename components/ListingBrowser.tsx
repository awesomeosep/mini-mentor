'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Availability = { day_of_week: number; start_time: string; end_time: string; format_note?: string };
type Skill = { skill_id: string; name: string };

type Listing = {
  listing_id: string;
  name: string;
  description?: string;
  status: string;
  end_date?: string;
  users: { userid: string; name: string; username: string };
  primary_skill: Skill;
  availability: Availability[];
};

export default function ListingBrowser() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Listing[]>([]);

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.listings || []);
        setFiltered(data.listings || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filteredListings = listings.filter(listing =>
      search.trim() === '' ||
      listing.primary_skill?.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredListings);
  }, [search, listings]);

  if (loading) return <p>Loading listings...</p>;
  if (!filtered.length) return <p>No listings match your search.</p>;

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by skill..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(listing => (
          <Card key={listing.listing_id}>
            <CardContent className="space-y-2">
              <h2 className="font-bold text-lg">{listing.name}</h2>
              <p>{listing.description}</p>
              <p><strong>Mentor:</strong> {listing.users.name} ({listing.users.username})</p>
              <p><strong>Skill:</strong> {listing.primary_skill?.name || 'N/A'}</p>
              {listing.availability?.length > 0 && (
                <p>
                  <strong>Availability:</strong>{' '}
                  {listing.availability.map(a => (
                    <span key={a.day_of_week}>
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][a.day_of_week]} {a.start_time}-{a.end_time}{' '}
                    </span>
                  ))}
                </p>
              )}
              <Button>Request Session</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

