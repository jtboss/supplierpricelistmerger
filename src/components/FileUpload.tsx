'use client'

import { useCallback, useState, useRef } from 'react'
import { FileUploadProps } from '@/types'
import { formatFileSize } from '@/lib/utils'
import { ExcelProcessor } from '@/lib/excel/processor'

export function FileUpload({ 
  onFilesSelected, 
  maxFileSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes = ['.xlsx', '.xls'],
  multiple = true,
  disabled = false 
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true)
    }
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    await processFiles(files)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled])

  const handleFileInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const files = Array.from(e.target.files || [])
    await processFiles(files)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled])

  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return

    setIsValidating(true)

    try {
      // Validate each file
      const validFiles: File[] = []
      const errors: string[] = []

      for (const file of files) {
        const validation = ExcelProcessor.validateFile(file)
        if (validation.isValid) {
          validFiles.push(file)
        } else {
          errors.push(`${file.name}: ${validation.error}`)
        }
      }

      if (errors.length > 0) {
        // You might want to show these errors in a toast or modal
        console.warn('File validation errors:', errors)
      }

      if (validFiles.length > 0) {
        onFilesSelected(validFiles)
      }
    } catch (error) {
      console.error('Error processing files:', error)
    } finally {
      setIsValidating(false)
    }
  }, [onFilesSelected])

  const handleBrowseClick = useCallback(() => {
    if (disabled || !fileInputRef.current) return
    fileInputRef.current.click()
  }, [disabled])

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Drag & Drop Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-out
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105' 
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50'}
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        {/* Upload Icon */}
        <div className="mb-6">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragActive 
              ? 'bg-blue-500 text-white scale-110' 
              : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            {isValidating ? (
              <svg className="animate-spin w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {isDragActive ? 'Drop your Excel files here' : 'Upload Supplier Price Lists'}
          </h3>
          
          <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {isDragActive 
              ? 'Release to upload your files'
              : 'Drag & drop Excel files here, or click to browse'
            }
          </p>

          {!isDragActive && (
            <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                .xlsx
              </span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                .xls
              </span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                Max {formatFileSize(maxFileSize)}
              </span>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Processing Overlay */}
        {isValidating && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Validating files...</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>
          We&apos;ll automatically detect cost columns and add markup calculations: 
          <strong className="text-slate-700 dark:text-slate-300"> 5%, 10%, 15%, 20%, 30%</strong>
        </p>
      </div>
    </div>
  )
}