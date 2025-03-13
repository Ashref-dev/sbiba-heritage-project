"use client";

import { useEffect, useState } from "react";

interface Breakpoint {
  name: string;
  width: number;
}

const breakpoints: Breakpoint[] = [
  { name: "sm", width: 640 },
  { name: "md", width: 768 },
  { name: "lg", width: 1024 },
  { name: "xl", width: 1280 },
  { name: "2xl", width: 1536 },
];

export function BreakpointIndicator() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("default");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const active = breakpoints.reduce((acc, breakpoint) => {
        return width >= breakpoint.width ? breakpoint.name : acc;
      }, "default");
      setCurrentBreakpoint(active);
    };

    // Initial check
    updateBreakpoint();

    // Add resize listener
    window.addEventListener("resize", updateBreakpoint);

    // Cleanup
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-2 right-2 z-50">
      <div className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-white">
        {currentBreakpoint}
      </div>
    </div>
  );
}
