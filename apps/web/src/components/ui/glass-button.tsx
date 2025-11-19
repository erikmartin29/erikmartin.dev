import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

// Mini-circuit pattern for the button background
const ButtonCircuit = () => (
  <svg 
    className="absolute inset-0 w-full h-full opacity-30 pointer-events-none mix-blend-overlay" 
    viewBox="0 0 100 40" 
    preserveAspectRatio="none"
  >
    <path 
      d="M0 20 L10 20 L15 10 L25 10 L30 20 L100 20 M20 10 L20 0 M80 20 L80 40" 
      stroke="currentColor" 
      strokeWidth="0.5" 
      fill="none" 
    />
    <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    <circle cx="25" cy="10" r="1.5" fill="currentColor" />
    <circle cx="80" cy="30" r="1.5" fill="currentColor" />
    <rect x="40" y="15" width="20" height="10" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
  </svg>
);

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 overflow-hidden",
          
          // Variants
          variant === "primary" && [
            // Base Glass/Plastic
            "bg-accent/80 text-white backdrop-blur-sm",
            // Borders & Highlights for 3D effect
            "border-t border-white/40 border-b border-black/20",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_8px_rgba(0,149,168,0.3)]",
            // Hover State
            "hover:bg-accent hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_12px_rgba(0,149,168,0.4)] hover:-translate-y-0.5",
          ],
          
          variant === "secondary" && [
             "bg-white/10 text-foreground backdrop-blur-md",
             "border border-white/20 border-t-white/30 border-b-black/10",
             "shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]",
             "hover:bg-white/20 hover:border-white/30"
          ],
            
          variant === "ghost" && 
            "bg-transparent hover:bg-white/10 text-foreground",

          // Sizes
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-6 text-base",
          size === "lg" && "h-14 px-8 text-lg",
          
          className
        )}
        {...props}
      >
        {/* Circuitry Overlay (Only for primary/secondary to keep ghost clean) */}
        {variant !== "ghost" && (
          <div className="absolute inset-0 -z-10 opacity-50">
             <ButtonCircuit />
          </div>
        )}
        
        {/* Glossy Shine Overlay */}
        {variant !== "ghost" && (
          <div className="absolute inset-x-0 top-0 h-[50%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        )}
        
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Comp>
    );
  }
);

GlassButton.displayName = "GlassButton";
