'use client';

import { useState } from 'react';

export default function ApplyButton({
  listingId,
  mentorId,
  learnerAvailability,
  mentorAvailability,
}: {
  listingId: string;
  mentorId: string;
  learnerAvailability: string;
  mentorAvailability: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          mentor_id: mentorId,
          learner_availability: learnerAvailability,
          mentor_availability: mentorAvailability,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      alert('Application submitted!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleApply}
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Submitting…' : 'Submit Application'}
      </button>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
