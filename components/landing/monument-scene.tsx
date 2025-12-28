"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

// Dynamically import Three.js components with no SSR
const Scene = dynamic(() => import("./scene"), {
  ssr: false,
});

interface MonumentSceneProps {
  className?: string;
}

export default function MonumentScene({ className }: MonumentSceneProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop version */}
      <div className="mt-8 hidden lg:block">
        <div className="container flex flex-col items-center">
          <h1 className="transform text-center text-5xl transition-transform duration-300 hover:rotate-2 md:text-6xl lg:text-7xl">
            This is{" "}
            <span className="text-var(--gradient-1) font-serif italic">
              Sbiba
            </span>
            , home to anicent Berber and Roman civilizations.
          </h1>
          <p className="my-auto mt-4 max-w-2xl transform text-center text-xl text-muted-foreground transition-transform duration-300 hover:-rotate-1 md:text-2xl">
            Where Roman grandeur meets Berber heritage, creating a timeless
            journey through Mediterranean history.
          </p>
          <div className={cn("h-[400px] w-full", className)}>
            <Scene scrollY={scrollY} />
          </div>
        </div>
      </div>
    </>
  );
}
