import * as React from "react";
import { cn } from "@/lib/utils"; // Or replace with your own `cn` helper

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md border border-transparent bg-blue-600 px-2 py-0.5 text-sm font-medium text-white",
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
