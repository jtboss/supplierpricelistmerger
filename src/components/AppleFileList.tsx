'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileSpreadsheet, FileText, X, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { fileItemVariants, cardVariants } from '@/lib/animations'

interface ProcessedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress?: number
  error?: string
}

interface FileListItemProps {
  file: ProcessedFile
  onRemove: (fileId: string) => void
  showStatus?: boolean
  showSize?: boolean
  showProgress?: boolean
  animated?: boolean
  className?: string
}

function FileListItem({ 
  file, 
  onRemove, 
  showStatus = true, 
  showSize = true, 
  showProgress = false,
  animated = true,
  className = ''
}: FileListItemProps) {
  const getFileIcon = () => {
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />
    }
    return <FileText className="w-5 h-5 text-blue-600" />
  }

  const getStatusIcon = () => {
    switch (file.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'processing':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="w-4 h-4 text-blue-500" />
          </motion.div>
        )
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (file.status) {
      case 'completed':
        return 'Completed'
      case 'error':
        return 'Error'
      case 'processing':
        return 'Processing'
      default:
        return 'Pending'
    }
  }

  const getStatusColor = () => {
    switch (file.status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  const cardProps = animated ? {
    variants: cardVariants,
    initial: "idle",
    whileHover: "hover"
  } : {}

  return (
    <motion.div
      {...cardProps}
      className={`
        group relative bg-white rounded-lg border border-gray-200 p-4 
        transition-all duration-200 ease-out
        hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5
        ${file.status === 'completed' ? 'ring-1 ring-green-200' : ''}
        ${file.status === 'error' ? 'ring-1 ring-red-200' : ''}
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        {/* File info section */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* File icon */}
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
            {getFileIcon()}
          </div>
          
          {/* File details */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate" title={file.name}>
              {file.name}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              {showSize && (
                <span className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </span>
              )}
              {showSize && showStatus && (
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
              )}
              {showStatus && (
                <div className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                  ${getStatusColor()}
                `}>
                  {getStatusIcon()}
                  <span className="ml-1">{getStatusText()}</span>
                </div>
              )}
            </div>
            
            {/* Progress bar */}
            {showProgress && file.progress !== undefined && (
              <motion.div 
                className="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${file.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </motion.div>
            )}
            
            {/* Error message */}
            {file.status === 'error' && file.error && (
              <motion.p 
                className="text-xs text-red-600 mt-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.2 }}
              >
                {file.error}
              </motion.p>
            )}
          </div>
        </div>

        {/* Actions section */}
        <div className="flex items-center space-x-2 ml-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(file.id)}
            className={`
              p-1.5 rounded-full transition-colors duration-200
              text-gray-400 hover:text-red-500 hover:bg-red-50
              opacity-0 group-hover:opacity-100
            `}
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

interface AppleFileListProps {
  files: ProcessedFile[]
  onRemoveFile: (fileId: string) => void
  showStatus?: boolean
  showSize?: boolean
  showProgress?: boolean
  className?: string
  emptyState?: React.ReactNode
}

export function AppleFileList({ 
  files, 
  onRemoveFile, 
  showStatus = true, 
  showSize = true, 
  showProgress = false,
  className = '',
  emptyState
}: AppleFileListProps) {
  if (files.length === 0 && emptyState) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center py-12 ${className}`}
      >
        {emptyState}
      </motion.div>
    )
  }

  return (
    <motion.div 
      className={`space-y-3 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            variants={fileItemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ delay: index * 0.05 }}
          >
            <FileListItem
              file={file}
              onRemove={onRemoveFile}
              showStatus={showStatus}
              showSize={showSize}
              showProgress={showProgress}
              animated={true}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

// File list summary component
interface FileListSummaryProps {
  files: ProcessedFile[]
  className?: string
}

export function FileListSummary({ files, className = '' }: FileListSummaryProps) {
  const stats = {
    total: files.length,
    completed: files.filter(f => f.status === 'completed').length,
    processing: files.filter(f => f.status === 'processing').length,
    error: files.filter(f => f.status === 'error').length,
    totalSize: files.reduce((acc, file) => acc + file.size, 0)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  return (
    <motion.div 
      className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="font-medium text-gray-900">{stats.total}</span>
            <span className="text-gray-500 ml-1">
              {stats.total === 1 ? 'file' : 'files'}
            </span>
          </div>
          
          {stats.completed > 0 && (
            <>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="text-sm">
                <span className="font-medium text-green-600">{stats.completed}</span>
                <span className="text-gray-500 ml-1">completed</span>
              </div>
            </>
          )}
          
          {stats.processing > 0 && (
            <>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="text-sm">
                <span className="font-medium text-blue-600">{stats.processing}</span>
                <span className="text-gray-500 ml-1">processing</span>
              </div>
            </>
          )}
          
          {stats.error > 0 && (
            <>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="text-sm">
                <span className="font-medium text-red-600">{stats.error}</span>
                <span className="text-gray-500 ml-1">failed</span>
              </div>
            </>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          {formatFileSize(stats.totalSize)}
        </div>
      </div>
    </motion.div>
  )
}