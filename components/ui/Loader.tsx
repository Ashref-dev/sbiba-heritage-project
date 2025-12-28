
export default function Loader({ size = 48 }: { size?: number }) {
  const s = size;
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
    >
      <svg
        width={s}
        height={s}
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-rotate"
      >
        <defs>
          <linearGradient id="g" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#E6A157" />
            <stop offset="100%" stopColor="#B86B4A" />
          </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd">
          <circle cx="22" cy="22" r="20" stroke="#ECECEC" strokeWidth="4" />
          <path
            d="M22 4 a18 18 0 0 1 0 36"
            stroke="url(#g)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      </svg>
      <style>{`
        .animate-rotate{animation: rotate 1.1s linear infinite}
        @keyframes rotate { to { transform: rotate(360deg)} }
      `}</style>
    </div>
  );
}
