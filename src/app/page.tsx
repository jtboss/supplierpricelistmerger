'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Sparkles, FileCheck, Upload } from 'lucide-react'
import { AppleDropZone } from '@/components/AppleDropZone'
import { AppleFileList, FileListSummary } from '@/components/AppleFileList'
import { AppleButton, MergeButton } from '@/components/AppleButton'
import { ProcessingProgress } from '@/components/AppleProgressIndicator'
import { containerVariants, pageVariants } from '@/lib/animations'

interface ProcessedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress?: number
  error?: string
}

type AppState = 'upload' | 'processing' | 'completed'

export default function ApplePage() {
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [appState, setAppState] = useState<AppState>('upload')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [currentProcessingStep, setCurrentProcessingStep] = useState('')
  const [mergedFileUrl, setMergedFileUrl] = useState<string | null>(null)

  const processingSteps = [
    'Validating file formats',
    'Reading Excel sheets',
    'Parsing CSV data',
    'Merging supplier data',
    'Generating output file',
    'Finalizing download'
  ]

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    const newFiles: ProcessedFile[] = selectedFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }))
    
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const handleRemoveFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }, [])

  const handleMergeFiles = useCallback(async () => {
    setAppState('processing')
    setProcessingProgress(0)
    
    // Simulate file processing with realistic timing
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentProcessingStep(processingSteps[i])
      
      // Update progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProcessingProgress((i * 100 + progress) / processingSteps.length)
      }
    }
    
    // Mark all files as completed
    setFiles(prev => prev.map(file => ({
      ...file,
      status: 'completed' as const
    })))
    
    // Simulate file generation
    setMergedFileUrl('/api/download/merged-suppliers.xlsx')
    setAppState('completed')
  }, [])

  const handleDownload = useCallback(() => {
    if (mergedFileUrl) {
      // In a real app, this would trigger the actual download
      console.log('Downloading:', mergedFileUrl)
      // Reset for another merge
      setTimeout(() => {
        setAppState('upload')
        setFiles([])
        setMergedFileUrl(null)
        setProcessingProgress(0)
      }, 2000)
    }
  }, [mergedFileUrl])

  const handleStartOver = useCallback(() => {
    setAppState('upload')
    setFiles([])
    setMergedFileUrl(null)
    setProcessingProgress(0)
    setCurrentProcessingStep('')
  }, [])

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div 
          className="text-center space-y-2 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900">
              Supplier File Merger
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Effortlessly merge Excel and CSV supplier files with our intelligent processing engine. 
            Simply upload your files and let us handle the complexity.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {appState === 'upload' && (
            <motion.div
              key="upload"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-8"
            >
              {/* Drop Zone */}
              <motion.div variants={containerVariants}>
                <AppleDropZone
                  onFilesSelected={handleFilesSelected}
                  acceptedTypes={['.xlsx', '.xls', '.csv']}
                  maxFiles={10}
                  maxFileSize="10MB"
                  title="Upload your supplier files"
                  subtitle="Drag and drop Excel or CSV files, or click to browse"
                  className="mb-8"
                />
              </motion.div>

              {/* File List */}
              {files.length > 0 && (
                <motion.div 
                  variants={containerVariants}
                  className="space-y-4"
                >
                  <FileListSummary files={files} />
                  
                  <AppleFileList
                    files={files}
                    onRemoveFile={handleRemoveFile}
                    showStatus={true}
                    showSize={true}
                    emptyState={
                      <div className="text-center py-12">
                        <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No files uploaded yet</p>
                      </div>
                    }
                  />
                  
                  {/* Merge Button */}
                  <MergeButton
                    files={files}
                    onMerge={handleMergeFiles}
                    disabled={files.length === 0}
                    className="mt-6"
                  />
                </motion.div>
              )}
            </motion.div>
          )}

          {appState === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto"
            >
              <ProcessingProgress
                currentStep={currentProcessingStep}
                steps={processingSteps}
                progress={processingProgress}
              />
            </motion.div>
          )}

          {appState === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              {/* Success State */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <FileCheck className="w-8 h-8 text-green-600" />
                </motion.div>
                
                <motion.h2 
                  className="text-2xl font-bold text-gray-900 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Files Merged Successfully!
                </motion.h2>
                
                <motion.p 
                  className="text-gray-600 mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Your supplier files have been intelligently merged and are ready for download.
                  The merged file contains all supplier data with proper formatting and validation.
                </motion.p>

                {/* File Summary */}
                <motion.div 
                  className="bg-gray-50 rounded-lg p-4 mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Files processed:</span>
                    <span className="font-semibold text-gray-900">{files.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Output format:</span>
                    <span className="font-semibold text-gray-900">Excel (.xlsx)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Estimated size:</span>
                    <span className="font-semibold text-gray-900">
                      {(files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024 * 0.8).toFixed(1)} MB
                    </span>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <AppleButton
                    variant="primary"
                    size="lg"
                    onClick={handleDownload}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Merged File</span>
                  </AppleButton>
                  
                  <AppleButton
                    variant="secondary"
                    size="lg"
                    onClick={handleStartOver}
                  >
                    Merge More Files
                  </AppleButton>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div 
          className="text-center mt-16 pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="text-sm text-gray-500">
            Built with precision and care. Designed for efficiency and elegance.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
