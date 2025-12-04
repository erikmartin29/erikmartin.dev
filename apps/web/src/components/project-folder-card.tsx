"use client"

import { useState, useEffect, useRef, useCallback, type MouseEvent } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"
import { GlassButton } from "@/components/ui/glass-button"
import { cn } from "@/lib/utils"

interface ProjectFolderCardProps {
  title: string
  description: string
  tags?: string[]
  link?: string
  github?: string
  imageUrls?: string[]
  isVisible?: boolean
}

type AnimationState = "closed" | "hover" | "open"

export function ProjectFolderCard({
  title,
  description,
  tags,
  link,
  github,
  imageUrls = [],
  isVisible = true,
}: ProjectFolderCardProps) {
  const [animationState, setAnimationState] = useState<AnimationState>("closed")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastClickRef = useRef(0)

  const isOpen = animationState === "open"

  const imagesToDisplay = imageUrls
  const totalImages = imagesToDisplay.length

  // Reset when card is hidden
  useEffect(() => {
    if (!isVisible) {
      setAnimationState("closed")
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current)
        leaveTimeoutRef.current = null
      }
    }
  }, [isVisible])

  // Clean up timeout
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current)
      }
    }
  }, [])

  const nextImage = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      if (totalImages > 0) {
        setCurrentImageIndex(prev => (prev + 1) % totalImages)
      }
    },
    [totalImages]
  )

  const handleMouseEnter = useCallback(() => {
    if (!isVisible) return

    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }

    if (animationState === "closed") {
      setAnimationState("hover")
    }
  }, [animationState, isVisible])

  const handleMouseLeave = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }

    if (animationState === "open") {
      setAnimationState("hover")

      leaveTimeoutRef.current = setTimeout(() => {
        setAnimationState("closed")
      }, 280)
    } else {
      setAnimationState("closed")
    }
  }, [animationState])

  const handleClick = useCallback(() => {
    if (!isVisible) return

    const now = performance.now()
    // Simple debounce to avoid stacking animations on Safari
    if (now - lastClickRef.current < 220) {
      return
    }
    lastClickRef.current = now

    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }

    if (animationState === "open") {
      setAnimationState("hover")
    } else {
      setAnimationState("open")
    }
  }, [animationState, isVisible])

  return (
    <motion.div
      className={cn(
        "relative h-[415px] w-full max-w-md mx-auto isolate perspective-[1000px]",
        isVisible ? "cursor-pointer" : "cursor-default pointer-events-none"
      )}
      style={{ willChange: "transform" }}
      initial="closed"
      animate={animationState}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.svg
        className="absolute inset-x-0 bottom-0 w-full h-[350px] z-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        variants={{
          closed: {
            y: 0,
            opacity: 1,
            transition: { opacity: { duration: 0.15, ease: "easeInOut" } },
          },
          hover: { y: 0, opacity: 1 },
          open: {
            y: 0,
            opacity: 0,
            transition: {
              rotateX: { duration: 0.25, ease: "easeInOut" },
              y: { duration: 0.25, ease: "easeInOut" },
              opacity: { duration: 0.05, ease: "easeOut" },
            },
          },
        }}
      >
        <path
          d="M0,16 0,4 Q0, 0 4,0 L30,0 L36,4 L96,4 Q100,4 100,10 L100,96 Q100,100 96,100 L4,100 Q0,100 0,96 Z"
          className="fill-[var(--accent-base)] stroke-white/10 border border-white/10"
          strokeWidth="0"
          vectorEffect="non-scaling-stroke"
        />
      </motion.svg>

      {imagesToDisplay.length > 0 ? (
        <>
          {imagesToDisplay.map((url, index) => {
            const diff =
              (index - currentImageIndex + totalImages) % totalImages

            // Only render top 3 for performance
            if (diff > 2) return null

            return (
              <motion.div
                key={`${url}-${index}`}
                className="absolute inset-x-6 bottom-4 h-[300px] overflow-hidden origin-bottom rounded-lg shadow-sm"
                style={{
                  zIndex: 20 - diff,
                  willChange: "transform",
                }}
                onClick={e => {
                  if (isOpen) {
                    nextImage(e)
                  }
                }}
                variants={{
                  closed: (diff: number) => ({
                    x: 0,
                    scale: diff < 3 ? 1 - diff * 0.02 : 0.9,
                    rotate: 0,
                    opacity: 0,
                    transition: { duration: 0.12, ease: "easeOut" },
                  }),
                  hover: (diff: number) => ({
                    y: diff < 3 ? -60 - diff * 15 : -60,
                    x: 0,
                    scale: 1,
                    rotate: diff < 3 ? (diff % 2 === 0 ? -1 : 1) * diff : 0,
                    opacity: diff < 3 ? 1 : 0,
                    transition: {
                      duration: 0.22,
                      ease: "easeOut",
                      delay: diff * 0.04,
                    },
                  }),
                  open: (diff: number) => {
                    if (diff === 0) {
                      return {
                        x: 0,
                        scale: 1.05,
                        opacity: 1,
                        rotate: 0,
                        transition: {
                          duration: 0.2,
                          ease: "easeOut",
                        },
                      }
                    } else if (diff === 1) {
                      return {
                        x: 16,
                        scale: 1.02,
                        opacity: 1,
                        rotate: 2,
                        transition: {
                          duration: 0.2,
                          ease: "easeOut",
                        },
                      }
                    } else if (diff === 2) {
                      return {
                        x: 28,
                        scale: 1,
                        opacity: 1,
                        rotate: 4,
                        transition: {
                          duration: 0.2,
                          ease: "easeOut",
                        },
                      }
                    } else {
                      return {
                        y: -220,
                        x: 0,
                        scale: 0.9,
                        opacity: 0,
                        rotate: 0,
                        transition: { duration: 0.16, ease: "easeIn" },
                      }
                    }
                  },
                }}
                custom={diff}
              >
                <Image
                  src={url}
                  alt={`${title} screenshot ${index + 1}`}
                  fill
                  className="object-cover"
                  loading={index === currentImageIndex ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 90vw, 400px"
                />
              </motion.div>
            )
          })}
        </>
      ) : (
        <motion.div
          className="absolute inset-x-6 bottom-12 h-[300px] z-20 rounded-xl overflow-hidden shadow-lg origin-bottom"
          variants={{
            closed: { y: 0, scale: 0.98, rotate: 0, opacity: 0.9 },
            hover: {
              y: -60,
              scale: 1,
              rotate: -1,
              opacity: 1,
              transition: { duration: 0.25, ease: "easeOut" },
            },
            open: { y: -150, scale: 1, rotate: 0, opacity: 1 },
          }}
          style={{ willChange: "transform" }}
        >
          <div className="w-full h-full flex items-center justify-center bg-accent/5 text-muted-foreground text-sm">
            No Preview
          </div>
        </motion.div>
      )}

      <motion.div
        className="absolute inset-x-0 bottom-0 h-[320px] z-30 origin-bottom"
        variants={{
          closed: { rotateX: 0, y: 0, opacity: 1 },
          hover: {
            rotateX: -15,
            y: -2,
            opacity: 1,
            transition: {
              rotateX: { duration: 0.25, ease: "easeInOut" },
              y: { duration: 0.25, ease: "easeInOut" },
              opacity: { duration: 0.15, ease: "easeOut" },
            },
          },
          open: {
            rotateX: -30,
            y: 0,
            opacity: 0,
            transition: {
              rotateX: { duration: 0.25, ease: "easeInOut" },
              y: { duration: 0.25, ease: "easeInOut" },
              opacity: { duration: 0.15, ease: "easeOut" },
            },
          },
        }}
        style={{
          transformStyle: "preserve-3d",
          pointerEvents: isOpen ? "none" : "auto",
          display: isOpen ? "none" : "block",
          willChange: "transform",
        }}
      >
        <div
          className={cn(
            "w-full h-full rounded-2xl p-6 flex flex-col",
            "shadow-[0_-5px_30px_rgba(0,0,0,0.3)]",
            "bg-[var(--accent-base)]"
          )}
        >
          <h3 className="text-xl font-bold mb-2 text-white line-clamp-1">
            {title}
          </h3>

          <p className="text-white/80 text-sm mb-4 line-clamp-5 grow">
            {description}
          </p>

          {tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 4).map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-white/70 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {(link || github) && (
            <div className="flex items-center gap-3 mt-auto">
              {link && (
                <Link
                  href={link}
                  className="flex-1"
                  target="_blank"
                  onClick={e => e.stopPropagation()}
                >
                  <GlassButton className="w-full gap-2 h-9 text-xs" size="sm">
                    Live <ExternalLink size={14} />
                  </GlassButton>
                </Link>
              )}
              {github && (
                <Link
                  href={github}
                  className="flex-1"
                  target="_blank"
                  onClick={e => e.stopPropagation()}
                >
                  <GlassButton
                    variant="secondary"
                    className="w-full gap-2 h-9 text-xs text-white"
                    size="sm"
                  >
                    Code <Github size={14} />
                  </GlassButton>
                </Link>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}