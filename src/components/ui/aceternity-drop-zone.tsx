'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle, File, FileSpreadsheet, FileText, Upload } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { FloatingIcon } from './floating-icon'

interface AceternityDropZoneProps {
    onFilesSelected: (files: File[]) => void
    acceptedTypes: string[]
    maxFiles?: number
    disabled?: boolean
    className?: string
    showFileTypes?: boolean
    maxFileSize?: string
    title?: string
    subtitle?: string
}

export function AceternityDropZone({
    onFilesSelected,
    acceptedTypes,
    maxFiles = 10,
    disabled = false,
    className = '',
    showFileTypes = true,
    maxFileSize = '10MB',
    title = 'Upload your supplier files',
    subtitle = 'Drag and drop Excel or CSV files, or click to browse'
}: AceternityDropZoneProps) {
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
                return <Upload className="w-8 h-8 text-aceternity-primary animate-pulse" />
            case 'success':
                return <CheckCircle className="w-8 h-8 text-aceternity-status-success" />
            case 'error':
                return <AlertCircle className="w-8 h-8 text-aceternity-status-error" />
            default:
                return <Upload className="w-8 h-8 text-aceternity-text-muted group-hover:text-aceternity-primary transition-colors duration-300" />
        }
    }

    const getStatusText = () => {
        switch (uploadStatus) {
            case 'uploading':
                return { primary: 'Processing files...', secondary: 'Analyzing your supplier data' }
            case 'success':
                return { primary: 'Files uploaded successfully!', secondary: 'Ready for processing' }
            case 'error':
                return { primary: 'Upload failed', secondary: 'Please try again or check your files' }
            default:
                return { primary: title, secondary: subtitle }
        }
    }

    const statusText = getStatusText()
    const isActive = isDragOver || uploadStatus === 'uploading'

    return (
        <div className={cn("relative w-full", className)}>
            <motion.div
                className={cn(
                    "group relative overflow-hidden rounded-3xl transition-all duration-500 ease-smooth cursor-pointer",
                    "border-2 border-dashed glassmorphism",
                    "hover:shadow-glow-medium hover:scale-[1.01]",
                    isActive && "border-aceternity-primary bg-gradient-to-br from-aceternity-primary/10 to-aceternity-secondary/10 scale-[1.02]",
                    !isActive && "border-aceternity-surface-border hover:border-aceternity-surface-border-hover",
                    disabled && "cursor-not-allowed opacity-50",
                    uploadStatus === 'success' && "border-aceternity-status-success/50 bg-aceternity-status-success/5",
                    uploadStatus === 'error' && "border-aceternity-status-error/50 bg-aceternity-status-error/5"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !disabled && document.getElementById('aceternity-file-input')?.click()}
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* Background grid pattern */}
                <div className="absolute inset-0 grid-pattern opacity-30" />

                {/* Glowing border effect */}
                <div className={cn(
                    "absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500",
                    "bg-gradient-to-r from-aceternity-primary to-aceternity-secondary",
                    "group-hover:opacity-20",
                    isActive && "opacity-30"
                )} />

                <div className="relative flex flex-col items-center justify-center p-16 text-center space-y-6">
                    {/* Main Icon */}
                    <FloatingIcon size="lg" pulseEffect={uploadStatus === 'idle'}>
                        {getStatusIcon()}
                    </FloatingIcon>

                    {/* Text Content */}
                    <div className="space-y-3">
                        <motion.h3
                            className={cn(
                                "text-2xl font-bold transition-colors duration-300",
                                uploadStatus === 'success' && "text-aceternity-status-success",
                                uploadStatus === 'error' && "text-aceternity-status-error",
                                uploadStatus === 'idle' && "text-aceternity-text-primary",
                                uploadStatus === 'uploading' && "text-aceternity-primary"
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
                                "text-lg transition-colors duration-300",
                                uploadStatus === 'success' && "text-aceternity-status-success/80",
                                uploadStatus === 'error' && "text-aceternity-status-error/80",
                                "text-aceternity-text-secondary"
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
                    {showFileTypes && uploadStatus === 'idle' && (
                        <motion.div
                            className="flex items-center space-x-6 pt-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center space-x-2 px-4 py-2 rounded-full glassmorphism">
                                <FileSpreadsheet className="w-5 h-5 text-aceternity-status-success" />
                                <span className="text-sm font-medium text-aceternity-text-secondary">Excel</span>
                            </div>
                            <div className="w-1 h-1 bg-aceternity-text-muted rounded-full" />
                            <div className="flex items-center space-x-2 px-4 py-2 rounded-full glassmorphism">
                                <FileText className="w-5 h-5 text-aceternity-status-info" />
                                <span className="text-sm font-medium text-aceternity-text-secondary">CSV</span>
                            </div>
                            <div className="w-1 h-1 bg-aceternity-text-muted rounded-full" />
                            <div className="flex items-center space-x-2 px-4 py-2 rounded-full glassmorphism">
                                <File className="w-5 h-5 text-aceternity-text-accent" />
                                <span className="text-sm font-medium text-aceternity-text-secondary">Max {maxFileSize}</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Progress indicator for uploading state */}
                    <AnimatePresence>
                        {uploadStatus === 'uploading' && (
                            <motion.div
                                className="w-64 h-2 bg-aceternity-surface-border rounded-full overflow-hidden"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <motion.div
                                    className="h-full bg-gradient-primary rounded-full"
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
                    id="aceternity-file-input"
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