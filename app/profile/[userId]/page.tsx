import ProfileHeader from '@/components/profile-page/components/profile-header';
import ProfileSettings from '@/components/ProfileSettings';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  } else {
    const profileRes = await supabase.from('users').select('*').eq('userid', user?.id).single();
    if (!profileRes) {
      redirect('/profile/new');
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <ProfileHeader userId={(await params).userId} />

      <ProfileSettings userId={(await params).userId} />
    </div>
  );
}
