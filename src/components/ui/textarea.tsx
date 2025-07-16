import * as React from "react"
import { cn } from "@/lib/utils"
import { FaPlus } from "react-icons/fa" // Import the plus icon

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <div className="relative flex items-center">
      {/* <span className="absolute left-3 text-muted-foreground pointer-events-none">
        <FaPlus />
      </span> */}
      <textarea
        data-slot="textarea"
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-8 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Textarea }
