import Link from 'next/link';
import HeaderAuth from '@/components/header-auth';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import React from 'react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { createClient } from '@/lib/supabase/server';

export async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profileRes, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('userid', user?.id)
    .limit(1)
    .single();

  return (
    <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
      <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
        <div className="flex items-center gap-5 font-semibold">
          <Link href={'/'} className="text-lg">
            MiniMentor
          </Link>
        </div>
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            {!user && (
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            {!user && (
              <NavigationMenuItem>
                <Link href="https://github.com/matmanna/mini-mentor" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    GitHub
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            {user && (profileError || !profileRes) ? (
              <NavigationMenuItem>
                <Link href="/profile/new" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Complete Profile
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ) : null}
            <NavigationMenuItem>
              <Link href="/dashboard" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {user && profileRes?.status == 'TEACHING' ? (
              <NavigationMenuItem>
                <Link href="/listings/new" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Create a Listing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ) : null}

            <NavigationMenuItem>
              <Link href="/listings" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Find a Mentorship
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex">
          <HeaderAuth />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle>
              <p className="text-xl font-extralight tracking-wider text-foreground sm:text-2xl">
                MiniMentor
              </p>
            </SheetTitle>
            <div className="my-5 grid gap-6 p-6">
              <SheetTrigger asChild>
                <Link
                  href="/"
                  className="text-sm font-medium underline-offset-4 hover:underline"
                  prefetch={false}
                >
                  Home
                </Link>
              </SheetTrigger>
              <SheetTrigger asChild>
                <Link
                  href="https://github.com/matmanna/mini-mentor"
                  className="text-sm font-medium underline-offset-4 hover:underline"
                  prefetch={false}
                >
                  GitHub
                </Link>
              </SheetTrigger>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
