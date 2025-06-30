
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-red-500",
        destructive: "text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-red-500",
        outline: "border bg-white hover:shadow-sm hover:-translate-y-0.5 focus-visible:ring-red-500",
        secondary: "text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-teal-500",
        ghost: "hover:shadow-sm hover:-translate-y-0.5 focus-visible:ring-red-500",
        link: "underline-offset-4 hover:underline focus-visible:ring-red-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Apply premium colors based on variant
    const getVariantStyles = () => {
      switch (variant) {
        case 'default':
          return 'bg-premium-primary hover:bg-premium-primary/90'
        case 'destructive':
          return 'bg-premium-primary hover:bg-premium-primary/90'
        case 'outline':
          return 'border-premium-secondary text-premium-deep hover:bg-premium-secondary/10 hover:border-premium-secondary'
        case 'secondary':
          return 'bg-premium-secondary hover:bg-premium-secondary/90'
        case 'ghost':
          return 'text-premium-deep hover:bg-premium-secondary/10 hover:text-premium-deep'
        case 'link':
          return 'text-premium-primary hover:text-premium-primary/80'
        default:
          return 'bg-premium-primary hover:bg-premium-primary/90'
      }
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), getVariantStyles(), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
