import SectionCards from '@/components/SectionCards';
import { createClient } from '@/lib/supabase/server';

export default async function StatsPage() {
  const supabase = await createClient();

  // get supabase users count
  const { count: userCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  const { count: mentorCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'TEACHING');
  const { count: matchCount } = await supabase
    .from('mentorship_match')
    .select('*', { count: 'exact', head: true });
  const { count: skillCount } = await supabase
    .from('skills')
    .select('*', { count: 'exact', head: true });
  const { count: listingCount } = await supabase
    .from('mentorship_listing')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards
            total_users={userCount}
            total_listings={listingCount}
            total_skills={skillCount}
            total_matches={matchCount}
            total_mentors={mentorCount}
          />
        </div>
      </div>
    </div>
  );
}
