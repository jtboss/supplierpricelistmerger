'use client'

import React, { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileSpreadsheet, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { dropZoneVariants } from '@/lib/animations'

interface DropZoneProps {
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

export function AppleDropZone({ 
  onFilesSelected, 
  acceptedTypes,
  maxFiles = 10,
  disabled = false,
  className = '',
  showFileTypes = true,
  maxFileSize = '10MB',
  title = 'Upload your supplier files',
  subtitle = 'Drag and drop Excel or CSV files, or click to browse'
}: DropZoneProps) {
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
      // Simulate upload process
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
        return <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Upload className="w-12 h-12 text-blue-500" />
        </motion.div>
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-500" />
      default:
        return <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
    }
  }

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return { primary: 'Uploading files...', secondary: 'Please wait while we process your files' }
      case 'success':
        return { primary: 'Files uploaded successfully!', secondary: 'Your files are ready to be processed' }
      case 'error':
        return { primary: 'Upload failed', secondary: 'Please try again or check your files' }
      default:
        return { primary: title, secondary: subtitle }
    }
  }

  const statusText = getStatusText()

  return (
    <div className={`relative w-full ${className}`}>
      <motion.div
        variants={dropZoneVariants}
        initial="idle"
        animate={isDragOver ? "dragOver" : "idle"}
        className={`
          group relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ease-out
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400'
          }
          ${disabled 
            ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50' 
            : 'cursor-pointer'
          }
          ${uploadStatus === 'success' ? 'border-green-400 bg-green-50' : ''}
          ${uploadStatus === 'error' ? 'border-red-400 bg-red-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex flex-col items-center justify-center p-12 text-center space-y-4">
          {/* Icon */}
          <motion.div
            animate={uploadStatus === 'uploading' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.6, repeat: uploadStatus === 'uploading' ? Infinity : 0 }}
          >
            {getStatusIcon()}
          </motion.div>

          {/* Primary text */}
          <motion.h3 
            className={`text-lg font-semibold transition-colors duration-200 ${
              uploadStatus === 'success' ? 'text-green-700' :
              uploadStatus === 'error' ? 'text-red-700' :
              'text-gray-700'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={statusText.primary}
          >
            {statusText.primary}
          </motion.h3>

          {/* Secondary text */}
          <motion.p 
            className={`text-sm transition-colors duration-200 ${
              uploadStatus === 'success' ? 'text-green-600' :
              uploadStatus === 'error' ? 'text-red-600' :
              'text-gray-500'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            key={statusText.secondary}
          >
            {statusText.secondary}
          </motion.p>

          {/* File type indicators */}
          {showFileTypes && uploadStatus === 'idle' && (
            <motion.div 
              className="flex items-center space-x-4 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                <span>Excel</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>CSV</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-xs text-gray-500">Max {maxFileSize}</span>
            </motion.div>
          )}

          {/* Progress indicator for uploading state */}
          {uploadStatus === 'uploading' && (
            <motion.div 
              className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </motion.div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          id="file-input"
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