'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface ShimmerButtonProps {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    loading?: boolean
    className?: string
    variant?: 'primary' | 'secondary'
    type?: 'button' | 'submit' | 'reset'
}

export function ShimmerButton({
    children,
    onClick,
    disabled = false,
    loading = false,
    className = "",
    variant = 'primary',
    type = 'button'
}: ShimmerButtonProps) {
    const isDisabled = disabled || loading

    const variantStyles = {
        primary: 'shimmer-button',
        secondary: 'border border-aceternity-surface-border bg-aceternity-surface-glass hover:bg-aceternity-surface-card rounded-full px-6 py-3 text-aceternity-text-primary font-semibold transition-all duration-300'
    }

    if (variant === 'secondary') {
        return (
            <motion.button
                type={type}
                onClick={onClick}
                disabled={isDisabled}
                className={cn(variantStyles.secondary, className)}
                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
            >
                {loading ? (
                    <div className="flex items-center space-x-2">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <Loader2 className="w-4 h-4" />
                        </motion.div>
                        <span>Loading...</span>
                    </div>
                ) : children}
            </motion.button>
        )
    }

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={cn(variantStyles.primary, className)}
            whileHover={!isDisabled ? { scale: 1.05 } : {}}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
        >
            <div className="shimmer-button-content">
                {loading ? (
                    <div className="flex items-center space-x-2">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <Loader2 className="w-4 h-4" />
                        </motion.div>
                        <span>Loading...</span>
                    </div>
                ) : children}
            </div>
        </motion.button>
    )
}