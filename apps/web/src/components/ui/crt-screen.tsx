import { cn } from "@/lib/utils";
import { HTMLAttributes, useId } from "react";

interface CrtScreenProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
}

export function CrtScreen({ src, alt, className, ...props }: CrtScreenProps) {
  const maskId = useId();
  
  // TV/CRT Barrel Distortion Path (Normalized 0-100)
  const screenPathDefinition = "M 5 5 Q 50 0 95 5 Q 100 50 95 95 Q 50 100 5 95 Q 0 50 5 5 Z";
  
  return (
    <div className={cn("relative inline-block group", className)} {...props}>
      {/* iMac G3 Body Silhouette (The "Gumdrop") */}
      <div className="relative bg-white dark:bg-[#2a2a2a] p-5 pt-6 rounded-t-[4rem] rounded-b-[2.5rem] shadow-2xl border-b-8 border-black/20 overflow-hidden w-full min-w-[260px]">
        
        {/* 1. Underlying Ribbed Texture (Molded Plastic) - Vertical Striations */}
        <div 
            className="absolute inset-0 opacity-10 pointer-events-none z-0"
            style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, #000 2px, #000 4px)',
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
            }}
        />

        {/* 2. Duo-tone Tint Layer (The "Flavor") */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 rounded-t-[4rem] rounded-b-[2.5rem]" 
          style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, transparent 60%), radial-gradient(circle at 50% 30%, rgba(255,255,255,0.4), transparent 50%)',
            mixBlendMode: 'multiply',
            opacity: 0.8
          }}
        />
        
        {/* 3. Glossy Highlights on the Shell */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-white/50 via-transparent to-black/20 rounded-t-[4rem] rounded-b-[2.5rem] opacity-80" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-xl" />

        {/* 4. The Inner Bezel (Opaque Gray Faceplate) */}
        <div className="relative z-10 bg-[#d4d4d4] dark:bg-[#333] p-4 pb-2 rounded-[2rem] shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.8)] mx-auto">
            
            {/* SVG Container for Screen Shape Masking */}
            <svg width="0" height="0" className="absolute">
                <defs>
                <clipPath id={maskId} clipPathUnits="objectBoundingBox">
                    <path d="M 0.05 0.05 Q 0.5 0 0.95 0.05 Q 1 0.5 0.95 0.95 Q 0.5 1 0.05 0.95 Q 0 0.5 0.05 0.05 Z" />
                </clipPath>
                </defs>
            </svg>

            {/* The CRT Screen Area */}
            <div className="relative aspect-[4/3] w-full bg-black rounded-[1.5rem] overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
                 
                 {/* Screen Content (Masked) */}
                 <div 
                    className="relative w-full h-full"
                    style={{ clipPath: `url(#${maskId})` }}
                 >
                        {/* Flicker Wrapper */}
                        <div className="w-full h-full" style={{ animation: 'flicker 0.15s infinite' }}>
                            {/* Image */}
                            {src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                                src={src} 
                                alt={alt || "Profile"} 
                                className="w-full h-full object-cover opacity-90 mix-blend-normal filter contrast-125 saturate-125"
                            />
                            ) : (
                            <div className="w-full h-full flex items-center justify-center text-accent/50 font-mono text-xs uppercase tracking-widest animate-pulse">
                                NO SIGNAL
                            </div>
                            )}
                             {/* Duo-tone Screen Overlay */}
                             <div className="absolute inset-0 bg-accent mix-blend-color opacity-40 pointer-events-none" />
                        </div>

                        {/* CRT Effects Layer (Scanlines + Glare) */}
                        <div className="absolute inset-0 pointer-events-none z-20">
                            <div 
                                className="absolute inset-0 opacity-30 mix-blend-overlay"
                                style={{
                                backgroundImage: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))`
                                , backgroundSize: "100% 3px, 3px 100%"
                                }}
                            />
                            {/* Bulbous Vignette */}
                            <div 
                                className="absolute inset-0" 
                                style={{
                                    background: 'radial-gradient(circle at center, transparent 50%, rgba(0, 0, 0, 0.3) 85%, rgba(0, 0, 0, 0.8) 100%)'
                                }}
                            />
                            {/* Glass Reflection */}
                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-md transform -translate-y-1/4" />
                        </div>
                 </div>
                 
                 {/* Vector Stroke Overlay for the Glass Edge */}
                 <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
                    <path 
                        d={screenPathDefinition} 
                        fill="none" 
                        stroke="rgba(0,0,0,0.6)" 
                        strokeWidth="3" 
                    />
                    <path 
                        d={screenPathDefinition} 
                        fill="none" 
                        stroke="rgba(255,255,255,0.15)" 
                        strokeWidth="1.5" 
                        transform="translate(0.5,0.5)"
                    />
                 </svg>
            </div>
            
            {/* iMac Label */}
            <div className="text-center mt-1 pb-1">
                <span className="font-serif italic text-neutral-500 text-[10px] font-bold tracking-wider">iMac</span>
            </div>
        </div>

        {/* 5. The Chin (Stereo Speakers & Drive) */}
        <div className="mt-4 flex items-center justify-between px-4 relative z-10">
            {/* Left Speaker (Oval Mesh) */}
            <div className="w-10 h-7 rounded-[40%] bg-accent shadow-[inset_0_1px_4px_rgba(0,0,0,0.4)] border border-white/10 relative overflow-hidden group-hover:animate-pulse">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 30%, transparent 31%)', backgroundSize: '3px 3px', opacity: 0.3 }} />
            </div>
            
            {/* CD Slot */}
            <div className="flex-1 mx-4 h-2.5 bg-black/20 rounded-full shadow-inner border-b border-white/30 flex items-center justify-center relative">
                 <div className="w-1/2 h-0.5 bg-black/40 rounded-full" />
                 {/* Eject Button */}
                 <div className="absolute -right-2 w-6 h-1.5 bg-accent rounded-full shadow-sm" />
            </div>

            {/* Right Speaker (Oval Mesh) */}
             <div className="w-10 h-7 rounded-[40%] bg-accent shadow-[inset_0_1px_4px_rgba(0,0,0,0.4)] border border-white/10 relative overflow-hidden group-hover:animate-pulse">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 30%, transparent 31%)', backgroundSize: '3px 3px', opacity: 0.3 }} />
            </div>
        </div>

        {/* Power Button */}
        <div className="absolute bottom-6 right-16 w-4 h-4 rounded-full bg-white/60 shadow-md border border-black/10 flex items-center justify-center z-20">
             <div className="w-2 h-2 rounded-full bg-green-400 border border-green-600/50 shadow-[0_0_4px_#4ade80]" />
        </div>

      </div>
    </div>
  );
}
