'use client'

import { MinimalButton } from '@/components/ui/minimal-button'
import { MinimalCard } from '@/components/ui/minimal-card'
import { MinimalDropZone } from '@/components/ui/minimal-drop-zone'
import { MasterWorkbookGenerator } from '@/lib/excel/masterWorkbook'
import { ExcelProcessor } from '@/lib/excel/processor'
import { generateId } from '@/lib/utils'
import { AppError, FileObject } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, FileCheck, FileSpreadsheet, Upload, X } from 'lucide-react'
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

export default function HomePage() {
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [appState, setAppState] = useState<AppState>('upload')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [currentProcessingStep, setCurrentProcessingStep] = useState('')
  const [mergedFileUrl, setMergedFileUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<AppError[]>([])

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

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const stepProgress = (i / files.length) * 100

        setCurrentProcessingStep(`Processing ${file.name}...`)
        setProcessingProgress(stepProgress)

        setFiles(prev => prev.map(f =>
          f.id === file.id ? { ...f, status: 'processing' as const } : f
        ))

        try {
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

          setFiles(prev => prev.map(f =>
            f.id === file.id ? {
              ...f,
              status: 'error' as const,
              error: errorMessage
            } : f
          ))
        }
      }

      if (processedFiles.length > 0) {
        setCurrentProcessingStep('Generating master workbook...')
        setProcessingProgress(90)

        const masterWorkbook = await MasterWorkbookGenerator.generateMasterWorkbook(processedFiles)

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-6 mx-auto">
            <FileSpreadsheet className="w-8 h-8 text-primary-foreground" />
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Supplier Price List Merger
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your supplier data with intelligent markup calculations.
            Clean, efficient, and reliable.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {appState === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <MinimalDropZone
                onFilesSelected={handleFilesSelected}
                acceptedTypes={['.xlsx', '.xls', '.csv']}
                maxFiles={10}
                title="Upload your supplier files"
                subtitle="Drag and drop Excel or CSV files, or click to browse"
              />

              {files.length > 0 && (
                <MinimalCard>
                  <h3 className="text-xl font-semibold mb-4">
                    Selected Files ({files.length})
                  </h3>
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileSpreadsheet className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          className="p-1 hover:bg-destructive/10 rounded text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-center">
                    <MinimalButton
                      onClick={handleMergeFiles}
                      size="lg"
                      className="px-8"
                    >
                      Merge {files.length} Files
                    </MinimalButton>
                  </div>
                </MinimalCard>
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
            >
              <MinimalCard className="text-center" padding="lg">
                <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6 mx-auto">
                  <Upload className="w-8 h-8 text-primary-foreground animate-pulse" />
                </div>

                <h2 className="text-2xl font-bold mb-4">
                  Processing Files...
                </h2>

                <p className="text-muted-foreground mb-6">
                  {currentProcessingStep}
                </p>

                <div className="minimal-progress mb-4">
                  <div
                    className="minimal-progress-indicator"
                    style={{ transform: `translateX(-${100 - processingProgress}%)` }}
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  {Math.round(processingProgress)}% Complete
                </p>
              </MinimalCard>
            </motion.div>
          )}

          {appState === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <MinimalCard className="text-center" padding="lg">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto">
                  <FileCheck className="w-8 h-8 text-green-600" />
                </div>

                <h2 className="text-2xl font-bold mb-4">
                  Merger Complete!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your supplier data has been processed and merged with markup calculations.
                </p>

                {files.filter(f => f.costColumnIndex !== undefined && f.costColumnIndex !== -1).length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-green-800 mb-1">
                      Markup Columns Added
                    </h3>
                    <p className="text-sm text-green-600">
                      Successfully added 5%, 10%, 15%, 20%, and 30% markup columns to {files.filter(f => f.costColumnIndex !== undefined && f.costColumnIndex !== -1).length} files
                    </p>
                  </div>
                )}

                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-red-800 mb-2">
                      Processing Errors
                    </h3>
                    <ul className="text-sm text-red-600 text-left space-y-1">
                      {errors.map(error => (
                        <li key={error.id}>• {error.message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <MinimalButton
                    onClick={handleDownload}
                    disabled={!mergedFileUrl}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Complete
                  </MinimalButton>

                  <MinimalButton
                    variant="secondary"
                    onClick={handleStartOver}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Process More Files
                  </MinimalButton>
                </div>
              </MinimalCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
