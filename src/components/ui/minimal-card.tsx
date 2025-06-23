'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface MinimalCardProps {
    children: React.ReactNode
    className?: string
    padding?: 'sm' | 'md' | 'lg'
    hover?: boolean
}

export function MinimalCard({
    children,
    className = "",
    padding = 'md',
    hover = true
}: MinimalCardProps) {
    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    }

    return (
        <div
            className={cn(
                "minimal-card",
                paddingClasses[padding],
                hover && "hover:shadow-md transition-shadow",
                className
            )}
        >
            {children}
        </div>
    )
}