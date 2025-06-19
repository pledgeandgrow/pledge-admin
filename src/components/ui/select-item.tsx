import * as React from "react"
import { cn } from "@/lib/utils"

// Using type alias instead of empty interface to avoid TypeScript warning
export type SelectItemProps = React.OptionHTMLAttributes<HTMLOptionElement>

const SelectItem = React.forwardRef<HTMLOptionElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <option
        ref={ref}
        className={cn("relative flex w-full cursor-default select-none py-1.5 pl-2 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
        {...props}
      >
        {children}
      </option>
    )
  }
)
SelectItem.displayName = "SelectItem"

export { SelectItem }
