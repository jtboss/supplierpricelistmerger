'use client'

import { AppleButton, MergeButton } from '@/components/AppleButton'
import { AppleDropZone } from '@/components/AppleDropZone'
import { AppleFileList } from '@/components/AppleFileList'
import { ProcessingProgress } from '@/components/AppleProgressIndicator'
import { containerVariants, pageVariants } from '@/lib/animations'
import { MasterWorkbookGenerator } from '@/lib/excel/masterWorkbook'
import { ExcelProcessor } from '@/lib/excel/processor'
import { generateId } from '@/lib/utils'
import { AppError, FileObject } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, FileCheck, Sparkles, Upload } from 'lucide-react'
import { useCallback, useState } from 'react'

interface ProcessedFile {
  id: string
  name: string
  size: number
  type: string
  file: File
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress?: number
  error?: string
  costColumnIndex?: number
}

type AppState = 'upload' | 'processing' | 'completed'

export default function ApplePage() {
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [appState, setAppState] = useState<AppState>('upload')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [currentProcessingStep, setCurrentProcessingStep] = useState('')
  const [mergedFileUrl, setMergedFileUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<AppError[]>([])

  const processingSteps = [
    'Validating file formats',
    'Reading Excel sheets',
    'Detecting cost columns',
    'Adding markup calculations',
    'Merging supplier data',
    'Generating master workbook'
  ]

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    const newFiles: ProcessedFile[] = selectedFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
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
    setErrors([])

    try {
      const processedFiles: FileObject[] = []

      // Process each file with real Excel processing
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const stepProgress = (i / files.length) * 100

        setCurrentProcessingStep(`Processing ${file.name}...`)
        setProcessingProgress(stepProgress)

        // Update file status to processing
        setFiles(prev => prev.map(f =>
          f.id === file.id ? { ...f, status: 'processing' as const } : f
        ))

        try {
          // Real Excel processing
          const result = await ExcelProcessor.processFile(file.file)

          const processedFile: FileObject = {
            id: file.id,
            name: file.name,
            size: file.size,
            type: file.type,
            file: file.file,
            workbook: result.workbook,
            costColumnIndex: result.analysis.costColumnIndex,
            errors: [],
            status: 'completed'
          }

          processedFiles.push(processedFile)

          // Update file status to completed
          setFiles(prev => prev.map(f =>
            f.id === file.id ? {
              ...f,
              status: 'completed' as const,
              costColumnIndex: result.analysis.costColumnIndex
            } : f
          ))

        } catch (err) {
          console.error(`Error processing file ${file.name}:`, err)

          const errorMessage = err instanceof Error ? err.message : 'Unknown processing error'
          const errorObj: AppError = {
            id: generateId(),
            type: 'PROCESSING_ERROR',
            message: errorMessage,
            fileId: file.id,
            timestamp: new Date(),
            severity: 'high'
          }

          setErrors(prev => [...prev, errorObj])

          // Update file status to error
          setFiles(prev => prev.map(f =>
            f.id === file.id ? {
              ...f,
              status: 'error' as const,
              error: errorMessage
            } : f
          ))
        }
      }

      // Generate master workbook if we have any successful files
      if (processedFiles.length > 0) {
        setCurrentProcessingStep('Generating master workbook...')
        setProcessingProgress(90)

        const masterWorkbook = await MasterWorkbookGenerator.generateMasterWorkbook(processedFiles)

        // Trigger download
        setCurrentProcessingStep('Preparing download...')
        setProcessingProgress(100)

        MasterWorkbookGenerator.downloadMasterWorkbook(masterWorkbook)
        setMergedFileUrl('/api/download/merged-suppliers.xlsx')
      }

      setAppState('completed')

    } catch (err) {
      console.error('Merge process failed:', err)
      const errorObj: AppError = {
        id: generateId(),
        type: 'PROCESSING_ERROR',
        message: err instanceof Error ? err.message : 'Merge process failed',
        timestamp: new Date(),
        severity: 'critical'
      }
      setErrors(prev => [...prev, errorObj])
      setAppState('upload')
    }
  }, [files])

  const handleDownload = useCallback(() => {
    if (mergedFileUrl) {
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
    setErrors([])
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <motion.div
        className="container mx-auto px-4 py-8"
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
      >
        {/* Header */}
        <motion.header
          className="text-center mb-12"
          variants={containerVariants}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Supplier Price List Merger
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your supplier data with intelligent markup calculations.
            <br />Tesla-level precision meets Jony Ive-inspired design.
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {appState === 'upload' && (
            <motion.div
              key="upload"
              variants={containerVariants}
              initial="initial"
              animate="in"
              exit="out"
              className="max-w-4xl mx-auto space-y-8"
            >
              <AppleDropZone
                onFilesSelected={handleFilesSelected}
                acceptedTypes={['.xlsx', '.xls', '.csv']}
                maxFiles={10}
                maxFileSize="10MB"
                title="Upload your supplier files"
                subtitle="Drag and drop Excel or CSV files, or click to browse"
              />

              {files.length > 0 && (
                <motion.div variants={containerVariants}>
                  <AppleFileList
                    files={files}
                    onRemoveFile={handleRemoveFile}
                    showStatus={true}
                    className="mb-6"
                  />

                  <div className="mt-8 flex justify-center">
                    <MergeButton
                      files={files}
                      onMerge={handleMergeFiles}
                      disabled={files.length === 0}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {appState === 'processing' && (
            <motion.div
              key="processing"
              variants={containerVariants}
              initial="initial"
              animate="in"
              exit="out"
              className="max-w-2xl mx-auto"
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
              variants={containerVariants}
              initial="initial"
              animate="in"
              exit="out"
              className="max-w-2xl mx-auto text-center space-y-8"
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <FileCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Merger Complete!
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Your supplier data has been processed and merged with markup calculations.
                </p>
              </div>

              {files.filter(f => f.costColumnIndex !== undefined && f.costColumnIndex !== -1).length > 0 && (
                <motion.div
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Markup Columns Added
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    Successfully added 5%, 10%, 15%, 20%, and 30% markup columns to {files.filter(f => f.costColumnIndex !== undefined && f.costColumnIndex !== -1).length} files
                  </p>
                </motion.div>
              )}

              {errors.length > 0 && (
                <motion.div
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                    Processing Errors
                  </h3>
                  <ul className="text-red-700 dark:text-red-300 text-left space-y-1">
                    {errors.map(error => (
                      <li key={error.id}>• {error.message}</li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AppleButton
                  variant="primary"
                  size="lg"
                  onClick={handleDownload}
                  disabled={!mergedFileUrl}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Complete</span>
                </AppleButton>

                <AppleButton
                  variant="secondary"
                  size="lg"
                  onClick={handleStartOver}
                  className="flex items-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Process More Files</span>
                </AppleButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
