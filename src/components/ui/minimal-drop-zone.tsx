'use client'

import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, FileSpreadsheet, FileText, Upload } from 'lucide-react'
import React, { useCallback, useState } from 'react'

interface MinimalDropZoneProps {
    onFilesSelected: (files: File[]) => void
    acceptedTypes: string[]
    maxFiles?: number
    disabled?: boolean
    className?: string
    title?: string
    subtitle?: string
}

export function MinimalDropZone({
    onFilesSelected,
    acceptedTypes,
    maxFiles = 10,
    disabled = false,
    className = '',
    title = 'Upload your supplier files',
    subtitle = 'Drag and drop Excel or CSV files, or click to browse'
}: MinimalDropZoneProps) {
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
                return <Upload className="w-8 h-8 text-primary animate-pulse" />
            case 'success':
                return <CheckCircle className="w-8 h-8 text-green-600" />
            case 'error':
                return <AlertCircle className="w-8 h-8 text-red-600" />
            default:
                return <Upload className="w-8 h-8 text-muted-foreground" />
        }
    }

    const getStatusText = () => {
        switch (uploadStatus) {
            case 'uploading':
                return { primary: 'Uploading files...', secondary: 'Please wait while we process your files' }
            case 'success':
                return { primary: 'Files uploaded successfully!', secondary: 'Ready for processing' }
            case 'error':
                return { primary: 'Upload failed', secondary: 'Please try again or check your files' }
            default:
                return { primary: title, secondary: subtitle }
        }
    }

    const statusText = getStatusText()

    return (
        <div className={cn("relative w-full", className)}>
            <div
                className={cn(
                    "border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 cursor-pointer",
                    "hover:border-primary/50 hover:bg-accent/50",
                    isDragOver && "border-primary bg-accent/50 scale-[1.02]",
                    !isDragOver && "border-border",
                    disabled && "cursor-not-allowed opacity-50",
                    uploadStatus === 'success' && "border-green-500/50 bg-green-50/50",
                    uploadStatus === 'error' && "border-red-500/50 bg-red-50/50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !disabled && document.getElementById('minimal-file-input')?.click()}
            >
                <div className="flex flex-col items-center space-y-4">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                        {getStatusIcon()}
                    </div>

                    {/* Text Content */}
                    <div className="space-y-2">
                        <h3 className={cn(
                            "text-lg font-semibold",
                            uploadStatus === 'success' && "text-green-600",
                            uploadStatus === 'error' && "text-red-600",
                            uploadStatus === 'uploading' && "text-primary"
                        )}>
                            {statusText.primary}
                        </h3>

                        <p className={cn(
                            "text-sm text-muted-foreground",
                            uploadStatus === 'success' && "text-green-600/80",
                            uploadStatus === 'error' && "text-red-600/80"
                        )}>
                            {statusText.secondary}
                        </p>
                    </div>

                    {/* File type indicators */}
                    {uploadStatus === 'idle' && (
                        <div className="flex items-center space-x-4 pt-2">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                <span>Excel</span>
                            </div>
                            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span>CSV</span>
                            </div>
                        </div>
                    )}

                    {/* Progress indicator */}
                    {uploadStatus === 'uploading' && (
                        <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '100%' }} />
                        </div>
                    )}
                </div>

                {/* Hidden file input */}
                <input
                    id="minimal-file-input"
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={disabled}
                />
            </div>
        </div>
    )
}