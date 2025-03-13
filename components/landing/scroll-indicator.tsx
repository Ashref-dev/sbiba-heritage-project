interface ScrollIndicatorProps {
  className?: string;
  text?: string;
}

export const ScrollIndicator = ({
  className = "",
  text = "Scroll • Discover • Explore • ",
}: ScrollIndicatorProps) => {
  return (
    <div className={`group flex flex-col items-center gap-4 ${className}`}>
      {/* Rotating ring with text */}
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <defs>
              <path
                id="scrollCircle"
                d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                fill="none"
              />
            </defs>
            <text className="fill-black/40 text-xs uppercase tracking-[0.25em]">
              <textPath href="#scrollCircle" startOffset="0%">
                {text}
              </textPath>
            </text>
          </svg>
        </div>

        {/* Center arrow container with gradient background */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-white/80 to-white p-3 shadow-lg ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="animate-bounce-slow"
          >
            <path
              d="M8 3v10m0 0l4-4m-4 4L4 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black/40"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
