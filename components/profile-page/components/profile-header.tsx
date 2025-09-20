'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Calendar, Mail, MapPin } from 'lucide-react';

type UserProfile = {
  userid: string;
  username: string;
  name: string;
  email?: string;
  avatar_url?: string;
  location?: string;
  join_date?: string;
  role: 'MENTOR' | 'LEARNER' | 'MODERATOR';
};

export default function ProfileHeader({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('userid', userId)
        .single();

      if (!error && data) setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [userId, supabase]);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.name} />
              ) : (
                <AvatarFallback className="text-2xl">
                  {profile.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('') || 'U'}
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <Badge variant="secondary">{profile.role}</Badge>
            </div>
            <p className="text-muted-foreground">{profile.username}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profile.email && (
                <div className="flex items-center gap-1">
                  <Mail className="size-4" />
                  {profile.email}
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {profile.location}
                </div>
              )}
              {profile.join_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  Joined {new Date(profile.join_date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
