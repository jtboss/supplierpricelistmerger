'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'

interface GlowingCardProps {
    children: React.ReactNode
    className?: string
    hoverGlow?: boolean
    tiltEffect?: boolean
}

export function GlowingCard({
    children,
    className = "",
    hoverGlow = true,
    tiltEffect = true
}: GlowingCardProps) {
    return (
        <motion.div
            className={cn("aceternity-card", className)}
            whileHover={hoverGlow ? { scale: 1.02 } : {}}
            animate={tiltEffect ? { rotateX: [0, 1, 0, -1, 0] } : {}}
            transition={{
                rotateX: {
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                },
                scale: {
                    duration: 0.3,
                    ease: "easeOut"
                }
            }}
        >
            {children}
        </motion.div>
    )
}