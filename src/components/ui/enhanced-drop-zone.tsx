'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle, FileSpreadsheet, FileText, Upload } from 'lucide-react'
import React, { useCallback, useState } from 'react'

interface EnhancedDropZoneProps {
    onFilesSelected: (files: File[]) => void
    acceptedTypes: string[]
    maxFiles?: number
    disabled?: boolean
    className?: string
    title?: string
    subtitle?: string
}

export function EnhancedDropZone({
    onFilesSelected,
    acceptedTypes,
    maxFiles = 10,
    disabled = false,
    className = '',
    title = 'Upload your supplier files',
    subtitle = 'Drag and drop Excel or CSV files, or click to browse'
}: EnhancedDropZoneProps) {
    const [isDragOver, setIsDragOver] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        if (!disabled) {
            setIsDragOver(true)
        }
    }, [disabled])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        if (disabled) return

        const files = Array.from(e.dataTransfer.files)
        const validFiles = files.filter(file => {
            const extension = file.name.split('.').pop()?.toLowerCase()
            return acceptedTypes.some(type => type.includes(extension || ''))
        })

        if (validFiles.length > 0) {
            setUploadStatus('uploading')
            setTimeout(() => {
                setUploadStatus('success')
                onFilesSelected(validFiles.slice(0, maxFiles))
                setTimeout(() => setUploadStatus('idle'), 2000)
            }, 1000)
        }
    }, [acceptedTypes, maxFiles, onFilesSelected, disabled])

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            setUploadStatus('uploading')
            setTimeout(() => {
                setUploadStatus('success')
                onFilesSelected(files.slice(0, maxFiles))
                setTimeout(() => setUploadStatus('idle'), 2000)
            }, 1000)
        }
    }, [maxFiles, onFilesSelected])

    const getStatusIcon = () => {
        switch (uploadStatus) {
            case 'uploading':
                return (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <Upload className="w-12 h-12 text-primary" />
                    </motion.div>
                )
            case 'success':
                return <CheckCircle className="w-12 h-12 text-green-500" />
            case 'error':
                return <AlertCircle className="w-12 h-12 text-red-500" />
            default:
                return <Upload className="w-12 h-12 text-muted-foreground" />
        }
    }

    const getStatusText = () => {
        switch (uploadStatus) {
            case 'uploading':
                return { primary: 'Processing files...', secondary: 'Analyzing your supplier data with AI' }
            case 'success':
                return { primary: 'Files uploaded successfully!', secondary: 'Ready for intelligent processing' }
            case 'error':
                return { primary: 'Upload failed', secondary: 'Please try again or check your files' }
            default:
                return { primary: title, secondary: subtitle }
        }
    }

    const statusText = getStatusText()

    return (
        <div className={cn("relative w-full", className)}>
            {/* Sparkles for decoration */}
            <div className="sparkles absolute inset-0 pointer-events-none">
                <div className="sparkle" style={{ top: '20%', left: '10%', animationDelay: '0s' }} />
                <div className="sparkle" style={{ top: '60%', left: '80%', animationDelay: '1s' }} />
                <div className="sparkle" style={{ top: '40%', left: '60%', animationDelay: '2s' }} />
            </div>

            <motion.div
                className={cn(
                    "relative overflow-hidden transition-all duration-500 cursor-pointer",
                    isDragOver ? "glow-border" : "enhanced-card",
                    disabled && "cursor-not-allowed opacity-50",
                    uploadStatus === 'success' && "border-green-500/50 bg-green-50/10",
                    uploadStatus === 'error' && "border-red-500/50 bg-red-50/10",
                    uploadStatus === 'uploading' && "glow-border"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !disabled && document.getElementById('enhanced-file-input')?.click()}
                whileHover={{ scale: isDragOver ? 1.02 : 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* Grid pattern background */}
                <div className="absolute inset-0 grid-pattern opacity-20" />

                {/* Aurora background for drag state */}
                <AnimatePresence>
                    {isDragOver && (
                        <motion.div
                            className="absolute inset-0 aurora-background opacity-30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            exit={{ opacity: 0 }}
                        />
                    )}
                </AnimatePresence>

                <div className="relative flex flex-col items-center justify-center p-16 text-center space-y-6">
                    {/* Icon with floating effect */}
                    <motion.div
                        className="floating relative"
                        animate={uploadStatus === 'uploading' ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.6, repeat: uploadStatus === 'uploading' ? Infinity : 0 }}
                    >
                        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                            {getStatusIcon()}
                        </div>
                    </motion.div>

                    {/* Text Content with generate effect */}
                    <div className="space-y-3">
                        <motion.h3
                            className={cn(
                                "text-2xl font-bold text-generate",
                                uploadStatus === 'success' && "text-green-600",
                                uploadStatus === 'error' && "text-red-600",
                                uploadStatus === 'uploading' && "text-primary"
                            )}
                            key={statusText.primary}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {statusText.primary}
                        </motion.h3>

                        <motion.p
                            className={cn(
                                "text-lg text-muted-foreground",
                                uploadStatus === 'success' && "text-green-600/80",
                                uploadStatus === 'error' && "text-red-600/80"
                            )}
                            key={statusText.secondary}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            {statusText.secondary}
                        </motion.p>
                    </div>

                    {/* File type indicators */}
                    {uploadStatus === 'idle' && (
                        <motion.div
                            className="flex items-center space-x-6 pt-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center space-x-2 px-4 py-2 rounded-full enhanced-card">
                                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium">Excel</span>
                            </div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <div className="flex items-center space-x-2 px-4 py-2 rounded-full enhanced-card">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium">CSV</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Progress indicator */}
                    <AnimatePresence>
                        {uploadStatus === 'uploading' && (
                            <motion.div
                                className="w-64 h-3 bg-muted rounded-full overflow-hidden"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <motion.div
                                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Hidden file input */}
                <input
                    id="enhanced-file-input"
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={disabled}
                />
            </motion.div>
        </div>
    )
}