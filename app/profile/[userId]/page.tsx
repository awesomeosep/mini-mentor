import ProfileHeader from '@/components/profile-page/components/profile-header';
import ProfileSettings from '@/components/ProfileSettings';

interface ProfilePageProps {
  params: { userId: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = params;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <ProfileHeader userId={userId} />

      <ProfileSettings userId={userId} />
    </div>
  );
}
