'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface EnhancedButtonProps {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    loading?: boolean
    className?: string
    variant?: 'primary' | 'secondary' | 'glow' | 'moving'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
}

export function EnhancedButton({
    children,
    onClick,
    disabled = false,
    loading = false,
    className = "",
    variant = 'primary',
    size = 'md',
    type = 'button'
}: EnhancedButtonProps) {
    const isDisabled = disabled || loading

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    }

    const getButtonContent = () => (
        loading ? (
            <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
            </div>
        ) : children
    )

    if (variant === 'glow') {
        return (
            <div className="glow-border">
                <motion.button
                    type={type}
                    onClick={onClick}
                    disabled={isDisabled}
                    className={cn(
                        "enhanced-button relative w-full h-full",
                        sizeClasses[size],
                        isDisabled && 'opacity-50 cursor-not-allowed',
                        className
                    )}
                    whileHover={!isDisabled ? { scale: 1.02 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                >
                    {getButtonContent()}
                </motion.button>
            </div>
        )
    }

    if (variant === 'moving') {
        return (
            <motion.button
                type={type}
                onClick={onClick}
                disabled={isDisabled}
                className={cn(
                    "moving-border relative",
                    sizeClasses[size],
                    "font-semibold text-foreground",
                    isDisabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
                {getButtonContent()}
            </motion.button>
        )
    }

    if (variant === 'secondary') {
        return (
            <motion.button
                type={type}
                onClick={onClick}
                disabled={isDisabled}
                className={cn(
                    "enhanced-card relative",
                    sizeClasses[size],
                    "font-semibold text-foreground border border-border hover-lift",
                    isDisabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
                {getButtonContent()}
            </motion.button>
        )
    }

    // Primary variant
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={cn(
                "enhanced-button relative",
                sizeClasses[size],
                isDisabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            whileHover={!isDisabled ? { scale: 1.02 } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
        >
            {getButtonContent()}
        </motion.button>
    )
}