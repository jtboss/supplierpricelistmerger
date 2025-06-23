'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface MinimalButtonProps {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    loading?: boolean
    className?: string
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
}

export function MinimalButton({
    children,
    onClick,
    disabled = false,
    loading = false,
    className = "",
    variant = 'primary',
    size = 'md',
    type = 'button'
}: MinimalButtonProps) {
    const isDisabled = disabled || loading

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    }

    const variantClasses = {
        primary: 'minimal-button minimal-button-primary',
        secondary: 'minimal-button minimal-button-secondary',
        outline: 'minimal-button border border-input bg-background hover:bg-accent hover:text-accent-foreground'
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={cn(
                variantClasses[variant],
                sizeClasses[size],
                isDisabled && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                </div>
            ) : children}
        </button>
    )
}