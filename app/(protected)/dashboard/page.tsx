import { Metadata } from 'next';
import Image from 'next/image';

import { cn } from '@/lib/utils';

import { CardsPayments } from '@/components/cards/payments';
import { CardsTeamMembers } from '@/components/cards/team-members';

export const metadata: Metadata = {
  title: 'Cards',
  description: 'Examples of cards built using the components.',
};

function DemoContainer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-center [&>div]:w-full', className)} {...props} />
  );
}

export default function CardsPage() {
  return (
    <>
      <div className="hidden items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <DemoContainer>
            <CardsPayments />
          </DemoContainer>
          <DemoContainer>
            <CardsTeamMembers />
          </DemoContainer>
        </div>
      </div>
    </>
  );
}
