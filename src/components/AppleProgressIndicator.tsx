'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { progressVariants } from '@/lib/animations'

interface AppleProgressIndicatorProps {
  progress: number
  variant?: 'linear' | 'circular'
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
  showDescription?: boolean
  currentStep?: string
  className?: string
  animated?: boolean
}

export function AppleProgressIndicator({
  progress,
  variant = 'linear',
  size = 'md',
  showPercentage = true,
  showDescription = true,
  currentStep,
  className = '',
  animated = true
}: AppleProgressIndicatorProps) {
  const sizeClasses = {
    sm: { height: 'h-1', text: 'text-xs', padding: 'p-2' },
    md: { height: 'h-2', text: 'text-sm', padding: 'p-4' },
    lg: { height: 'h-3', text: 'text-base', padding: 'p-6' }
  }

  if (variant === 'circular') {
    return (
      <CircularProgress 
        progress={progress}
        size={size}
        showPercentage={showPercentage}
        className={className}
        animated={animated}
      />
    )
  }

  // Linear progress (default)
  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className={`font-medium text-gray-700 ${sizeClasses[size].text}`}>
            Progress
          </span>
          <motion.span 
            className={`font-semibold text-blue-600 ${sizeClasses[size].text}`}
            key={progress}
            initial={animated ? { scale: 0.8, opacity: 0 } : false}
            animate={animated ? { scale: 1, opacity: 1 } : false}
            transition={{ duration: 0.2 }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size].height} overflow-hidden`}>
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full relative"
          variants={animated ? progressVariants : undefined}
          initial={animated ? "hidden" : false}
          animate={animated ? "visible" : false}
          custom={progress}
          style={!animated ? { width: `${progress}%` } : undefined}
        >
          {/* Animated shimmer effect */}
          {animated && progress > 0 && progress < 100 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </div>
      
      {showDescription && currentStep && (
        <motion.p 
          className={`mt-2 text-gray-600 ${sizeClasses[size].text}`}
          initial={animated ? { opacity: 0, y: 5 } : false}
          animate={animated ? { opacity: 1, y: 0 } : false}
          transition={{ delay: 0.1 }}
        >
          {currentStep}
        </motion.p>
      )}
    </div>
  )
}

interface CircularProgressProps {
  progress: number
  size: 'sm' | 'md' | 'lg'
  showPercentage: boolean
  className: string
  animated: boolean
}

function CircularProgress({ 
  progress, 
  size, 
  showPercentage, 
  className, 
  animated 
}: CircularProgressProps) {
  const sizeMap = {
    sm: { size: 'w-12 h-12', strokeWidth: 2, fontSize: 'text-xs' },
    md: { size: 'w-16 h-16', strokeWidth: 3, fontSize: 'text-sm' },
    lg: { size: 'w-24 h-24', strokeWidth: 4, fontSize: 'text-base' }
  }
  
  const { size: sizeClass, strokeWidth, fontSize } = sizeMap[size]
  const radius = 50 - strokeWidth
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={`relative ${sizeClass} ${className}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className="text-blue-500"
          style={
            animated 
              ? undefined 
              : {
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset
                }
          }
          initial={animated ? {
            strokeDasharray: circumference,
            strokeDashoffset: circumference
          } : false}
          animate={animated ? {
            strokeDashoffset: strokeDashoffset
          } : false}
          transition={animated ? {
            duration: 1,
            ease: "easeInOut"
          } : undefined}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className={`font-semibold text-gray-700 ${fontSize}`}
            key={progress}
            initial={animated ? { scale: 0.8, opacity: 0 } : false}
            animate={animated ? { scale: 1, opacity: 1 } : false}
            transition={{ duration: 0.2, delay: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      )}
    </div>
  )
}

// Specialized processing progress component
interface ProcessingProgressProps {
  currentStep: string
  steps: string[]
  progress: number
  className?: string
}

export function ProcessingProgress({ 
  currentStep, 
  steps, 
  progress, 
  className = '' 
}: ProcessingProgressProps) {
  return (
    <motion.div 
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 mx-auto mb-4"
        >
          <div className="w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Processing Files
        </h3>
        
        <p className="text-sm text-gray-600">
          {currentStep}
        </p>
      </div>
      
      <AppleProgressIndicator
        progress={progress}
        variant="linear"
        size="md"
        showPercentage={true}
        animated={true}
      />
      
      <div className="mt-4 space-y-2">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            className={`text-xs flex items-center space-x-2 ${
              step === currentStep ? 'text-blue-600' : 'text-gray-400'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`w-1 h-1 rounded-full ${
              step === currentStep ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
            <span>{step}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}