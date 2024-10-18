import * as React from "react";
import { cn } from "~/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onPressEnter?: any; // Add the onPressEnter prop
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onPressEnter, ...props }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && onPressEnter) {
        onPressEnter(); // Call the onPressEnter function when Enter is pressed
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onKeyDown={handleKeyDown} // Add the onKeyDown handler
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
