import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
      destructive: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 shadow-sm",
      outline: "border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#1a1b26] hover:bg-slate-100 dark:hover:bg-[#2a2b3d] text-slate-900 dark:text-slate-100 hover:text-slate-900 dark:hover:text-white",
      secondary: "bg-slate-100 dark:bg-[#2a2b3d] text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-[#3b3c54]",
      ghost: "hover:bg-slate-100 dark:hover:bg-[#2a2b3d] hover:text-slate-900 dark:hover:text-white text-slate-700 dark:text-slate-300",
      link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline",
    }
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    }
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
