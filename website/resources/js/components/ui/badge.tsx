import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-[3px] transition-[color,box-shadow] overflow-auto",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-main text-background [a&]:hover:bg-main/90 focus-visible:border-main focus-visible:ring-main/50",
        secondary:
          "border-transparent bg-secondary text-on-secondary [a&]:hover:bg-secondary/90 focus-visible:border-secondary focus-visible:ring-secondary/50",
        destructive:
          "border-transparent bg-tertiary text-white [a&]:hover:bg-tertiary/90 focus-visible:border-tertiary focus-visible:ring-tertiary/20",
        outline:
          "border-secondary text-on-background bg-transparent [a&]:hover:bg-secondary/10 [a&]:hover:text-on-background focus-visible:border-main focus-visible:ring-main/50",
        tertiary:
          "border-transparent bg-tertiary/10 text-tertiary [a&]:hover:bg-tertiary/20 focus-visible:border-tertiary focus-visible:ring-tertiary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }