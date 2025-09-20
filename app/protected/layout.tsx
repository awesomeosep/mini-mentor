// app/protected/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6 p-4">
      <div className="flex items-center gap-3 rounded-md bg-accent p-3 text-sm text-foreground">
        You are authenticated as <strong>{user.email}</strong>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
