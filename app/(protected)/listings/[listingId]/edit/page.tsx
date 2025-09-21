import { createClient } from '@/lib/supabase/server';
import ListingForm, { ListingInput } from '@/components/ListingForm';

interface PageProps {
  params: Promise<{ listingId: string }>;
}

export default async function EditListingPage({ params }: PageProps) {
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from('mentorship_listing')
    .select('listing_id,name,description,status,end_date,primary_skill_id,mentor_user_id')
    .eq('listing_id', (await params).listingId)
    .single();

  const { data: mentorAvailability } = await supabase
    .from('user_availability')
    .select('*')
    .eq('user_id', listing?.mentor_user_id)
    .single();

  console.log(listing, error);

  if (error || !listing) {
    return <div className="p-6">Listing not found</div>;
  }

  const defaultValues: ListingInput = {
    name: listing.name,
    description: listing.description ?? '',
    status: listing.status,
    end_date: listing.end_date ?? '',
    primary_skill_id: listing.primary_skill_id,
    availability: mentorAvailability ?? [],
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Edit Listing</h1>
      <ListingForm defaultValues={defaultValues} isEdit listingId={(await params).listingId} />
    </div>
  );
}
