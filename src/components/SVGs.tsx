import React from "react";

export const LogoImg = ({ className = "w-32 h-32 text-black dark:text-white", ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-label="Lawyer Firm Logo" role="img" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Scales of Justice */}
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Central pillar */}
      <rect x="30" y="10" width="4" height="34" rx="2" fill="currentColor" />
      {/* Top bar */}
      <line x1="16" y1="18" x2="48" y2="18" />
      {/* Left chain */}
      <line x1="20" y1="18" x2="14" y2="34" />
      {/* Right chain */}
      <line x1="44" y1="18" x2="50" y2="34" />
      {/* Left pan */}
      <ellipse cx="14" cy="36.5" rx="5" ry="2.5" fill="currentColor" />
      {/* Right pan */}
      <ellipse cx="50" cy="36.5" rx="5" ry="2.5" fill="currentColor" />
      {/* Base */}
      <rect x="22" y="46" width="20" height="6" rx="2" fill="currentColor" />
    </g>
  </svg>
);
