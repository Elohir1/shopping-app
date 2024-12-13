import * as React from "react"
import { cn } from "../../lib/utils"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantStyles = {
      default: "bg-background text-foreground",
      destructive: "border-destructive/50 text-destructive dark:border-destructive bg-red-100"
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Alert.displayName = "Alert"

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  )
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }