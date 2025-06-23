'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { buttonVariants } from '@/lib/animations'

interface AppleButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  loadingText?: string
  successText?: string
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export function AppleButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  loadingText = 'Processing...',
  successText,
  className = '',
  onClick,
  type = 'button'
}: AppleButtonProps) {
  const isDisabled = disabled || loading

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 
      text-white font-semibold
      hover:from-blue-700 hover:to-blue-800
      active:from-blue-800 active:to-blue-900
      shadow-md hover:shadow-lg
      disabled:from-gray-300 disabled:to-gray-400
      disabled:text-gray-500 disabled:shadow-none
    `,
    secondary: `
      bg-white border-2 border-gray-300 
      text-gray-700 font-semibold
      hover:bg-gray-50 hover:border-gray-400
      active:bg-gray-100 active:border-gray-500
      shadow-sm hover:shadow-md
      disabled:bg-gray-100 disabled:border-gray-200
      disabled:text-gray-400 disabled:shadow-none
    `,
    ghost: `
      bg-transparent 
      text-gray-600 font-medium
      hover:bg-gray-100 hover:text-gray-700
      active:bg-gray-200
      disabled:text-gray-400 disabled:bg-transparent
    `
  }

  const buttonContent = loading ? (
    <div className="flex items-center space-x-2">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-4 h-4" />
      </motion.div>
      <span>{loadingText}</span>
    </div>
  ) : children

  return (
    <motion.button
      variants={buttonVariants}
      initial="idle"
      whileHover={!isDisabled ? "hover" : "idle"}
      whileTap={!isDisabled ? "tap" : "idle"}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        rounded-lg transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        transform-gpu
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: loading ? 0.7 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {buttonContent}
      </motion.span>
    </motion.button>
  )
}

// Specialized merge button component
interface MergeButtonProps {
  files: any[]
  onMerge: () => Promise<void>
  disabled?: boolean
  loading?: boolean
  className?: string
}

export function MergeButton({ 
  files, 
  onMerge, 
  disabled = false, 
  loading = false,
  className = ''
}: MergeButtonProps) {
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleMerge = async () => {
    setIsProcessing(true)
    try {
      await onMerge()
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error('Merge failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getButtonText = () => {
    if (isSuccess) return '✓ Files Merged Successfully'
    if (isProcessing || loading) return 'Merging Files...'
    if (files.length === 0) return 'Select Files to Merge'
    if (files.length === 1) return 'Merge 1 File'
    return `Merge ${files.length} Files`
  }

  const getButtonVariant = () => {
    if (isSuccess) return 'secondary'
    return 'primary'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`sticky bottom-6 ${className}`}
    >
      <AppleButton
        variant={getButtonVariant()}
        size="lg"
        loading={isProcessing || loading}
        disabled={disabled || files.length === 0 || isProcessing}
        onClick={handleMerge}
        className={`
          w-full shadow-lg
          ${isSuccess ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
        `}
      >
        {getButtonText()}
      </AppleButton>
    </motion.div>
  )
}