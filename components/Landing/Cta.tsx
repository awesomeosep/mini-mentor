import { Button } from '@/components/ui/button';
import Link from 'next/link';
export function Cta() {
  return (
    <section>
      <div className="container">
        <div className="flex w-full flex-col gap-16 overflow-hidden rounded-lg bg-accent p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-16">
          <div className="flex-1">
            <h3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
              What are you waiting for?
            </h3>
            <p className="text-muted-foreground lg:text-lg">
              Join Mini-Mentor today and take the first step towards achieving your goals!
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link href="sign-up">
              <Button variant="outline">Sign Up</Button>
            </Link>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
