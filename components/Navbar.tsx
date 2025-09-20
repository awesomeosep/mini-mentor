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
import Image from 'next/image';
import React from 'react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { createClient } from '@/lib/supabase/server';

export async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
      <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
        <div className="flex items-center gap-5 font-semibold">
          <Link href={'/'} className="text-lg">

      <svg data-logo="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 235 42" width="120px" height="21px" className="dark:text-white text-black"  >
        <g id="logogram" transform="translate(0, 1) rotate(0) "><path d="M16.6584 40H15.3817C12.0653 40 10.07 39.9994 8.54581 39.7159L17.3668 28.0344L16.6584 40Z" fill="#FF1616"/><path d="M31.2482 39.7514C29.7502 39.9988 27.7875 40 24.6183 40H23.109L22.397 28.0309L31.2482 39.7514Z" fill="#FF1616"/><path d="M39.6715 31.6708C39.6071 31.9773 39.5313 32.2655 39.4389 32.5426C38.8337 34.3567 37.7712 35.9522 36.3867 37.1982L26.44 26.044L39.6715 31.6708Z" fill="#FF1616"/><path d="M3.48544 37.0792C2.16397 35.8511 1.14739 34.3 0.56108 32.5426C0.459551 32.2382 0.375253 31.921 0.307173 31.5803L13.3239 26.0458L3.48544 37.0792Z" fill="#FF1616"/><path d="M40 24.6183C40 25.7428 39.9968 26.7154 39.9858 27.5692L28.1729 23.006H40V24.6183Z" fill="#FF1616"/><path d="M11.5962 23.006L0.0106534 27.4805C0.000706106 26.6481 0 25.704 0 24.6183V23.006H11.5962Z" fill="#FF1616"/><path d="M24.6183 0C28.7807 0 30.862 0.000553673 32.5426 0.56108C35.7979 1.64713 38.3529 4.20208 39.4389 7.45739C39.9994 9.13798 40 11.2193 40 15.3817V20.016H27.5089L36.5181 16.1861L33.8459 14.4123L25.1048 17.7876L29.2081 12.358L26.2571 11.5501L21.7259 16.6282L21.3885 10.9091H18.3825L18.0398 16.6282L13.5121 11.5501L10.5629 12.358L14.6609 17.7859L5.92507 14.4123L3.25284 16.1861L12.2603 20.016H0V15.3817C0 11.2193 0.000553673 9.13798 0.56108 7.45739C1.64713 4.20208 4.20208 1.64713 7.45739 0.56108C9.13798 0.000553673 11.2193 0 15.3817 0H24.6183Z" fill="#FF1616"/></g>
        <g id="logotype" transform="translate(46, 7.5)"><path fill="currentColor" d="M13.49 27L8.31 27L8.31 1.54L16.31 1.54L20.44 13.23Q20.70 14.05 21.03 15.34Q21.36 16.64 21.71 18.15Q22.05 19.65 22.35 21.07Q22.65 22.49 22.83 23.53L22.83 23.53L21.83 23.53Q22.01 22.51 22.31 21.10Q22.61 19.69 22.95 18.18Q23.29 16.68 23.63 15.36Q23.96 14.05 24.22 13.23L24.22 13.23L28.29 1.54L36.32 1.54L36.32 27L31.07 27L31.07 14.99Q31.07 14.17 31.10 12.92Q31.14 11.67 31.17 10.23Q31.21 8.78 31.24 7.32Q31.28 5.86 31.29 4.56L31.29 4.56L31.62 4.56Q31.29 5.98 30.90 7.49Q30.51 9.00 30.11 10.42Q29.70 11.84 29.34 13.03Q28.99 14.22 28.73 14.99L28.73 14.99L24.51 27L20.12 27L15.83 14.99Q15.57 14.22 15.21 13.05Q14.85 11.88 14.45 10.46Q14.05 9.04 13.64 7.53Q13.23 6.01 12.85 4.56L12.85 4.56L13.26 4.56Q13.28 5.79 13.31 7.24Q13.35 8.70 13.39 10.16Q13.43 11.62 13.46 12.88Q13.49 14.13 13.49 14.99L13.49 14.99L13.49 27ZM43.65 27L38.52 27L38.52 7.89L43.65 7.89L43.65 27ZM41.08 5.40L41.08 5.40Q39.92 5.40 39.10 4.63Q38.28 3.86 38.28 2.77L38.28 2.77Q38.28 1.67 39.10 0.90Q39.92 0.13 41.08 0.13L41.08 0.13Q42.25 0.13 43.07 0.90Q43.90 1.66 43.90 2.77L43.90 2.77Q43.90 3.86 43.07 4.63Q42.25 5.40 41.08 5.40ZM50.86 15.94L50.86 15.94L50.86 27L45.73 27L45.73 7.89L50.57 7.89L50.65 12.66L50.34 12.66Q51.10 10.27 52.63 8.96Q54.16 7.65 56.58 7.65L56.58 7.65Q58.56 7.65 60.03 8.52Q61.50 9.38 62.32 11.00Q63.14 12.61 63.14 14.85L63.14 14.85L63.14 27L58.02 27L58.02 15.74Q58.02 13.96 57.10 12.95Q56.19 11.94 54.57 11.94L54.57 11.94Q53.49 11.94 52.64 12.41Q51.80 12.88 51.33 13.77Q50.86 14.66 50.86 15.94ZM70.37 27L65.24 27L65.24 7.89L70.37 7.89L70.37 27ZM67.81 5.40L67.81 5.40Q66.65 5.40 65.83 4.63Q65.01 3.86 65.01 2.77L65.01 2.77Q65.01 1.67 65.83 0.90Q66.65 0.13 67.81 0.13L67.81 0.13Q68.97 0.13 69.80 0.90Q70.63 1.66 70.63 2.77L70.63 2.77Q70.63 3.86 69.80 4.63Q68.97 5.40 67.81 5.40ZM83.77 27L78.59 27L78.59 1.54L86.59 1.54L90.72 13.23Q90.98 14.05 91.31 15.34Q91.64 16.64 91.99 18.15Q92.33 19.65 92.63 21.07Q92.93 22.49 93.11 23.53L93.11 23.53L92.11 23.53Q92.29 22.51 92.59 21.10Q92.89 19.69 93.23 18.18Q93.58 16.68 93.91 15.36Q94.24 14.05 94.50 13.23L94.50 13.23L98.57 1.54L106.60 1.54L106.60 27L101.35 27L101.35 14.99Q101.35 14.17 101.39 12.92Q101.42 11.67 101.45 10.23Q101.49 8.78 101.52 7.32Q101.56 5.86 101.57 4.56L101.57 4.56L101.90 4.56Q101.57 5.98 101.18 7.49Q100.79 9.00 100.39 10.42Q99.98 11.84 99.63 13.03Q99.27 14.22 99.01 14.99L99.01 14.99L94.79 27L90.40 27L86.11 14.99Q85.85 14.22 85.49 13.05Q85.13 11.88 84.73 10.46Q84.33 9.04 83.92 7.53Q83.51 6.01 83.13 4.56L83.13 4.56L83.54 4.56Q83.56 5.79 83.59 7.24Q83.63 8.70 83.67 10.16Q83.71 11.62 83.74 12.88Q83.77 14.13 83.77 14.99L83.77 14.99L83.77 27ZM117.43 27.38L117.43 27.38Q114.51 27.38 112.39 26.18Q110.27 24.98 109.13 22.78Q108.00 20.57 108.00 17.55L108.00 17.55Q108.00 14.59 109.12 12.37Q110.25 10.15 112.32 8.90Q114.39 7.65 117.17 7.65L117.17 7.65Q119.05 7.65 120.68 8.25Q122.30 8.85 123.53 10.06Q124.76 11.26 125.45 13.07Q126.15 14.88 126.15 17.34L126.15 17.34L126.15 18.78L110.10 18.78L110.10 15.57L123.63 15.57L121.24 16.42Q121.24 14.93 120.79 13.83Q120.34 12.73 119.44 12.12Q118.54 11.52 117.21 11.52L117.21 11.52Q115.89 11.52 114.96 12.13Q114.03 12.75 113.55 13.80Q113.07 14.85 113.07 16.20L113.07 16.20L113.07 18.47Q113.07 20.13 113.63 21.26Q114.18 22.39 115.18 22.95Q116.18 23.51 117.52 23.51L117.52 23.51Q118.42 23.51 119.16 23.26Q119.89 23.00 120.41 22.50Q120.93 21.99 121.21 21.26L121.21 21.26L125.86 22.13Q125.39 23.70 124.25 24.89Q123.10 26.08 121.39 26.73Q119.67 27.38 117.43 27.38ZM132.50 15.94L132.50 15.94L132.50 27L127.37 27L127.37 7.89L132.21 7.89L132.30 12.66L131.99 12.66Q132.74 10.27 134.27 8.96Q135.80 7.65 138.23 7.65L138.23 7.65Q140.21 7.65 141.68 8.52Q143.15 9.38 143.97 11.00Q144.79 12.61 144.79 14.85L144.79 14.85L144.79 27L139.66 27L139.66 15.74Q139.66 13.96 138.75 12.95Q137.83 11.94 136.21 11.94L136.21 11.94Q135.13 11.94 134.29 12.41Q133.44 12.88 132.97 13.77Q132.50 14.66 132.50 15.94ZM145.04 7.89L156.37 7.89L156.37 11.81L145.04 11.81L145.04 7.89ZM147.68 21.86L147.68 3.35L152.80 3.35L152.80 21.41Q152.80 22.32 153.20 22.75Q153.61 23.19 154.55 23.19L154.55 23.19Q154.84 23.19 155.37 23.11Q155.90 23.04 156.17 22.97L156.17 22.97L156.90 26.81Q156.05 27.07 155.20 27.17Q154.36 27.27 153.59 27.27L153.59 27.27Q150.72 27.27 149.20 25.87Q147.68 24.47 147.68 21.86L147.68 21.86ZM165.98 27.38L165.98 27.38Q163.11 27.38 161.00 26.14Q158.90 24.90 157.76 22.68Q156.63 20.47 156.63 17.53L156.63 17.53Q156.63 14.56 157.76 12.35Q158.90 10.13 161.00 8.89Q163.11 7.65 165.98 7.65L165.98 7.65Q168.86 7.65 170.96 8.89Q173.05 10.13 174.19 12.35Q175.32 14.56 175.32 17.53L175.32 17.53Q175.32 20.47 174.19 22.68Q173.05 24.90 170.96 26.14Q168.86 27.38 165.98 27.38ZM165.98 23.34L165.98 23.34Q167.34 23.34 168.27 22.58Q169.19 21.82 169.65 20.50Q170.11 19.17 170.11 17.52L170.11 17.52Q170.11 15.82 169.65 14.51Q169.19 13.19 168.27 12.44Q167.34 11.69 165.98 11.69L165.98 11.69Q164.61 11.69 163.70 12.44Q162.78 13.19 162.32 14.51Q161.86 15.82 161.86 17.52L161.86 17.52Q161.86 19.17 162.32 20.50Q162.78 21.82 163.70 22.58Q164.61 23.34 165.98 23.34ZM181.75 27L176.62 27L176.62 7.89L181.58 7.89L181.58 11.23L181.78 11.23Q182.31 9.45 183.55 8.54Q184.79 7.64 186.40 7.64L186.40 7.64Q186.79 7.64 187.24 7.68Q187.70 7.72 188.05 7.81L188.05 7.81L188.05 12.39Q187.71 12.27 187.06 12.20Q186.41 12.13 185.83 12.13L185.83 12.13Q184.67 12.13 183.73 12.64Q182.79 13.14 182.27 14.04Q181.75 14.93 181.75 16.13L181.75 16.13L181.75 27Z"/></g>
        
      </svg>
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
            {user && (
              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
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
                Example
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
                  href="/about"
                  className="text-sm font-medium underline-offset-4 hover:underline"
                  prefetch={false}
                >
                  About
                </Link>
              </SheetTrigger>
              <SheetTrigger asChild>
                <Link
                  href="/blog"
                  className="text-sm font-medium underline-offset-4 hover:underline"
                  prefetch={false}
                >
                  Blog
                </Link>
              </SheetTrigger>
              <hr />
              <SheetTrigger asChild>
                <Link
                  href="#"
                  className="text-sm font-medium underline-offset-4 hover:underline"
                  prefetch={false}
                >
                  Documentation
                </Link>
              </SheetTrigger>
              <hr />
              <SheetTrigger asChild>
                <Link
                  href="/contact"
                  className="text-sm font-medium underline-offset-4 hover:underline"
                  prefetch={false}
                >
                  Contact
                </Link>
              </SheetTrigger>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
