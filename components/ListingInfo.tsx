'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

interface ListingInfoProps {
  listing: {
    listing_id: string;
    title: string;
    description: string;
    creation_date: string;
    primary_skill_id?: string;
    mentor_user_id?: string;
  };
}

export default function ListingInfo({ listing }: ListingInfoProps) {
  const creatorName = '';
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{listing.title}</CardTitle>
        <div className="mt-2 flex flex-wrap gap-2"></div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="whitespace-pre-line text-muted-foreground">{listing.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <UserIcon size={16} />
            {creatorName}
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            {format(new Date(listing.creation_date), 'PPP')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
