'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'

interface FloatingIconProps {
    children: React.ReactNode
    className?: string
    size?: 'sm' | 'md' | 'lg'
    pulseEffect?: boolean
    hoverEffect?: boolean
}

export function FloatingIcon({
    children,
    className = "",
    size = 'md',
    pulseEffect = true,
    hoverEffect = true
}: FloatingIconProps) {
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-20 h-20',
        lg: 'w-24 h-24'
    }

    return (
        <motion.div
            className={cn(
                "floating-icon",
                sizeClasses[size],
                className
            )}
            animate={pulseEffect ? {
                boxShadow: [
                    'var(--shadow-glow-medium)',
                    'var(--shadow-glow-strong)',
                    'var(--shadow-glow-medium)'
                ],
                scale: [1, 1.05, 1],
            } : {}}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            whileHover={hoverEffect ? {
                scale: 1.1,
                rotate: 5,
                boxShadow: 'var(--shadow-glow-strong)'
            } : {}}
        >
            {children}
        </motion.div>
    )
}