"use client"

import * as React from "react"
import { cn } from "./card"

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: "left" | "right" | "top" | "bottom"
  className?: string
}

export function Tooltip({ content, children, side = "left", className }: TooltipProps) {
  const positionClasses = {
    left: "right-full mr-3 top-1/2 -translate-y-1/2",
    right: "left-full ml-3 top-1/2 -translate-y-1/2",
    top: "bottom-full mb-3 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-3 left-1/2 -translate-x-1/2",
  }

  const arrowClasses = {
    left: "left-full top-1/2 -translate-y-1/2 border-l-zinc-800 border-y-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-zinc-800 border-y-transparent border-l-transparent",
    top: "top-full left-1/2 -translate-x-1/2 border-t-zinc-800 border-x-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-zinc-800 border-x-transparent border-t-transparent",
  }

  return (
    <div className={cn("relative group", className)}>
      {children}
      <div
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-100 shadow-md",
          "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100",
          "transition-all duration-150 ease-out",
          positionClasses[side]
        )}
      >
        {content}
        <span
          className={cn(
            "absolute w-0 h-0 border-4",
            arrowClasses[side]
          )}
        />
      </div>
    </div>
  )
}
