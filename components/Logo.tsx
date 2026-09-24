import { useId } from "react";
import { cn } from "@/lib/utils";

/** Chapterly mark: a play triangle beside three chapter ticks, on a red→amber gradient tile. */
export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" role="img" aria-label="Chapterly logo" className={cn("size-7", className)}>
      <defs>
        <linearGradient id={id} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${id})`} />
      {/* chapter ticks */}
      <rect x="6.5" y="9" width="3" height="4.5" rx="1.5" fill="white" opacity="0.55" />
      <rect x="6.5" y="14.75" width="3" height="4.5" rx="1.5" fill="white" opacity="0.8" />
      <rect x="6.5" y="20.5" width="3" height="4.5" rx="1.5" fill="white" opacity="0.55" />
      {/* play */}
      <path d="M14.5 10.8v10.4c0 .8.9 1.3 1.6.9l8-5.2c.6-.4.6-1.4 0-1.8l-8-5.2c-.7-.4-1.6.1-1.6.9Z" fill="white" />
    </svg>
  );
}

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <LogoMark className={markClassName} />
      Chapterly
    </span>
  );
}
