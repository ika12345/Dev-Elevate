import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-900/60 text-gray-100 hover:bg-gray-900/70",
        secondary:
          "border-transparent bg-blue-900/60 text-blue-100 hover:bg-blue-900/70",
        destructive:
          "border-transparent bg-red-900/60 text-red-100 hover:bg-red-900/70",
        outline: "border-gray-700 text-gray-300 hover:bg-gray-800/40",
        success: "border-transparent bg-green-900/60 text-green-100 hover:bg-green-900/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
