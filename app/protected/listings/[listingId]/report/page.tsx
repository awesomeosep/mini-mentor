import ReportForm from '@/components/ReportForm';

interface ListingPageProps {
  params: { listingId: string };
}

export default function ListingPage({ params }: ListingPageProps) {
  const { listingId } = params;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <ReportForm listingId={listingId} />
    </div>
  );
}
