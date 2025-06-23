'use client'

import { cn } from '@/lib/utils'

interface BackgroundBeamsProps {
    className?: string
}

export function BackgroundBeams({ className }: BackgroundBeamsProps) {
    return (
        <div className={cn("background-beams", className)}>
            <div className="beam" style={{ animationDuration: '3s' }} />
            <div className="beam" style={{ animationDuration: '3.5s' }} />
            <div className="beam" style={{ animationDuration: '4s' }} />
            <div className="beam" style={{ animationDuration: '3.2s' }} />
            <div className="beam" style={{ animationDuration: '3.8s' }} />
            <div className="beam" style={{ animationDuration: '4.2s' }} />
        </div>
    )
}