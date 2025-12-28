"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coins, Menu } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  points?: number;
  user?: {
    email?: string | null;
  } | null;
}

export function Header({ points, user }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavigationItems = () => (
    <div className="flex gap-2">
      <Link
        href="/sites"
        className="group inline-flex h-9 w-max items-center justify-center rounded-full bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        Monuments
      </Link>
      <Link
        href="/feed"
        className="group inline-flex h-9 w-max items-center justify-center rounded-full bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        Feed
      </Link>
    </div>
  );

  return (
    <header
      className={`fixed left-1/2 right-auto top-4 z-50 mx-auto transition-all duration-300 ease-in-out ${
        isScrolled
          ? "w-[calc(100%-2rem)] md:w-[calc(60%-2rem)]"
          : "w-[calc(100%-2rem)]"
      } max-w-7xl -translate-x-1/2 rounded-full bg-background/60 backdrop-blur-sm`}
    >
      <div className="animate-fade-down-header container grid grid-cols-3 items-center px-4 py-2">
        {/* Left Navigation - Hidden on Mobile */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-1">
              <NavigationMenuItem>
                <NavigationItems />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu Button - Shown only on Mobile */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col">
                <NavigationItems />
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Center Logo */}
        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-gradient-1 bg-muted px-3 py-1 transition-all duration-300 hover:shadow-lg"
          >
            <svg
              className="size-8 md:size-12"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              x="0px"
              y="0px"
              viewBox="0 0 120 120"
              xmlSpace="preserve"
            >
              <path d="M60,17.5c-27.02,0-49,19.07-49,42.5c0,10.47,4.4,20.06,11.66,27.48c0.12,0.16,0.26,0.3,0.42,0.42  c8.99,8.94,22.2,14.61,36.92,14.61c12.47,0,23.87-4.07,32.53-10.75c0.19-0.1,0.36-0.23,0.5-0.38C102.84,83.59,109,72.41,109,60  C109,36.57,87.02,17.5,60,17.5z M26.99,72.77h11.48v8.55H26.52L26.99,72.77z M26.3,85.32h20.3v5.39c0,1.1,0.9,2,2,2s2-0.9,2-2v-5.39  h2.93c1.1,0,2-0.9,2-2s-0.9-2-2-2H42.46v-8.55h9.46c1.1,0,2-0.9,2-2s-0.9-2-2-2h-1.32v-4.41c0-1.1-0.9-2-2-2s-2,0.9-2,2v4.41H35.18  v-4.41c0-1.1-0.9-2-2-2s-2,0.9-2,2v4.41H27.2l0.61-11.2l7.89,2.67c0.34,0.11,0.7,0.14,1.04,0.06l7.7-1.58l8.4,3.15  c0.68,0.25,1.45,0.12,2-0.35l1.55-1.32l2.13,38.27c-12.81-0.36-24.28-5.31-32.22-13L26.3,85.32z M90.43,48.79V61.5H78.68v-4.67h8.61  c1.1,0,2-0.9,2-2s-0.9-2-2-2h-3.14v-4.05H90.43z M79.25,92c1.1,0,2-0.9,2-2s-0.9-2-2-2H68.93v-9.86h11.21v5.18c0,1.1,0.9,2,2,2  s2-0.9,2-2v-5.18h1.32c1.1,0,2-0.9,2-2s-0.9-2-2-2h-9.04v-4.96c0-1.1-0.9-2-2-2s-2,0.9-2,2v4.96h-3.5V65.5h20.64v23.48  c-3.86,2.89-8.3,5.22-13.14,6.85V92H79.25z M68.07,61.5v-4.67h6.61v4.67H68.07z M80.14,52.83H68.07v-4.05h12.07V52.83z M68.93,92  h3.5v4.99c-1.15,0.28-2.31,0.54-3.5,0.74V92z M93.57,85.6V65.14c0.52-0.36,0.86-0.96,0.86-1.64V46.79c0-1.1-0.9-2-2-2H66.07  c-1.1,0-2,0.9-2,2V63.5c0,0.68,0.34,1.28,0.86,1.64v33.13c-0.8,0.07-1.6,0.13-2.41,0.17l-2.36-42.5c-0.04-0.76-0.51-1.43-1.21-1.73  c-0.7-0.3-1.51-0.17-2.09,0.32l-3.72,3.19l-7.83-2.93c-0.35-0.13-0.74-0.16-1.1-0.09l-7.73,1.59l-9.87-3.34  c-0.59-0.2-1.25-0.11-1.76,0.24S24,54.1,23.96,54.72l-1.44,26.55C17.77,75.18,15,67.86,15,60c0-21.23,20.19-38.5,45-38.5  s45,17.27,45,38.5C105,69.82,100.67,78.79,93.57,85.6z" />
            </svg>
            <span className="mr-2 hidden whitespace-nowrap font-serif text-base font-light sm:inline md:text-xl">
              Sbiba Heritage Project
            </span>
            <span className="mr-2 whitespace-nowrap font-serif text-base font-light sm:hidden md:text-xl">
              SHP
            </span>
          </Link>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center justify-end gap-2 md:gap-4">
          {!user ? (
            <Button
              variant="secondary"
              className="flex items-center gap-1 rounded-full bg-muted text-sm"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-1 rounded-full border border-dashed p-2 text-xs font-semibold md:text-sm">
                <Coins className="size-3 md:size-4" />
                <span className="hidden sm:inline">{points} points</span>
                <span className="sm:hidden">{points}</span>
              </div>
              <Button
                variant="link"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden text-sm text-primary sm:inline-flex"
              >
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
