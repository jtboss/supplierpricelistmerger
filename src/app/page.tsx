'use client'

import { AceternityDropZone } from '@/components/ui/aceternity-drop-zone'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { FloatingIcon } from '@/components/ui/floating-icon'
import { GlowingCard } from '@/components/ui/glowing-card'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { MasterWorkbookGenerator } from '@/lib/excel/masterWorkbook'
import { ExcelProcessor } from '@/lib/excel/processor'
import { generateId } from '@/lib/utils'
import { AppError, FileObject } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Download, FileCheck, Layers, Shield, Sparkles, Upload, Zap } from 'lucide-react'
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

export default function AceternityPage() {
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [appState, setAppState] = useState<AppState>('upload')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [currentProcessingStep, setCurrentProcessingStep] = useState('')
  const [mergedFileUrl, setMergedFileUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<AppError[]>([])

  // Processing steps for potential future use
  // const processingSteps = [
  //   'Validating file formats',
  //   'Reading Excel sheets', 
  //   'Detecting cost columns',
  //   'Adding markup calculations',
  //   'Merging supplier data',
  //   'Generating master workbook'
  // ]

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

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast Processing",
      description: "Advanced algorithms for rapid Excel analysis"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Your data never leaves your browser"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Smart Markup Detection",
      description: "AI-powered cost column identification"
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundBeams className="opacity-60" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <motion.div
        className="container mx-auto px-4 py-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <FloatingIcon size="lg" className="mx-auto mb-8">
            <Sparkles className="w-12 h-12 text-white" />
          </FloatingIcon>

          <h1 className="text-hero font-bold text-gradient-hero mb-6 leading-tight">
            Supplier Price List Merger
          </h1>

          <p className="text-xl text-aceternity-text-secondary max-w-3xl mx-auto leading-relaxed">
            Transform your supplier data with intelligent markup calculations.
            <br />
            <span className="text-gradient-accent font-semibold">Tesla-level precision meets Aceternity-inspired design.</span>
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {appState === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto space-y-12"
            >
              <AceternityDropZone
                onFilesSelected={handleFilesSelected}
                acceptedTypes={['.xlsx', '.xls', '.csv']}
                maxFiles={10}
                maxFileSize="10MB"
                title="Upload your supplier files"
                subtitle="Drag and drop Excel or CSV files, or click to browse"
              />

              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <GlowingCard className="mb-8">
                    <h3 className="text-2xl font-bold text-aceternity-text-primary mb-6">
                      Selected Files ({files.length})
                    </h3>
                    <div className="grid gap-4">
                      {files.map((file) => (
                        <motion.div
                          key={file.id}
                          className="flex items-center justify-between p-4 rounded-2xl glassmorphism border border-aceternity-surface-border"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-3 h-3 rounded-full bg-gradient-primary animate-pulse" />
                            <div>
                              <p className="font-semibold text-aceternity-text-primary">{file.name}</p>
                              <p className="text-sm text-aceternity-text-muted">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="text-aceternity-status-error hover:bg-aceternity-status-error/10 p-2 rounded-full transition-colors"
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </GlowingCard>

                  <div className="flex justify-center">
                    <ShimmerButton onClick={handleMergeFiles}>
                      <span className="flex items-center space-x-2">
                        <span>Merge {files.length} Files</span>
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </ShimmerButton>
                  </div>
                </motion.div>
              )}

              {/* Features Section */}
              <motion.div
                className="grid md:grid-cols-3 gap-8 mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {features.map((feature, index) => (
                  <GlowingCard key={index} className="text-center p-8">
                    <FloatingIcon className="mx-auto mb-4" size="md">
                      {feature.icon}
                    </FloatingIcon>
                    <h3 className="text-xl font-bold text-aceternity-text-primary mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-aceternity-text-secondary">
                      {feature.description}
                    </p>
                  </GlowingCard>
                ))}
              </motion.div>
            </motion.div>
          )}

          {appState === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <GlowingCard className="text-center p-12">
                <FloatingIcon size="lg" className="mx-auto mb-8" pulseEffect>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </motion.div>
                </FloatingIcon>

                <h2 className="text-3xl font-bold text-aceternity-text-primary mb-4">
                  Processing Files...
                </h2>

                <p className="text-lg text-aceternity-text-secondary mb-8">
                  {currentProcessingStep}
                </p>

                <div className="w-full bg-aceternity-surface-border rounded-full h-3 mb-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${processingProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                <p className="text-sm text-aceternity-text-muted">
                  {Math.round(processingProgress)}% Complete
                </p>
              </GlowingCard>
            </motion.div>
          )}

          {appState === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center space-y-8"
            >
              <FloatingIcon size="lg" className="mx-auto">
                <FileCheck className="w-12 h-12 text-aceternity-status-success" />
              </FloatingIcon>

              <GlowingCard className="p-12">
                <h2 className="text-4xl font-bold text-gradient-hero mb-4">
                  Merger Complete!
                </h2>
                <p className="text-lg text-aceternity-text-secondary mb-8">
                  Your supplier data has been processed and merged with markup calculations.
                </p>

                {files.filter(f => f.costColumnIndex !== undefined && f.costColumnIndex !== -1).length > 0 && (
                  <motion.div
                    className="glassmorphism rounded-2xl p-6 mb-8 border border-aceternity-status-success/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-lg font-semibold text-aceternity-status-success mb-2">
                      Markup Columns Added
                    </h3>
                    <p className="text-aceternity-text-secondary">
                      Successfully added 5%, 10%, 15%, 20%, and 30% markup columns to {files.filter(f => f.costColumnIndex !== undefined && f.costColumnIndex !== -1).length} files
                    </p>
                  </motion.div>
                )}

                {errors.length > 0 && (
                  <motion.div
                    className="glassmorphism rounded-2xl p-6 mb-8 border border-aceternity-status-error/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-lg font-semibold text-aceternity-status-error mb-2">
                      Processing Errors
                    </h3>
                    <ul className="text-aceternity-text-secondary text-left space-y-1">
                      {errors.map(error => (
                        <li key={error.id}>• {error.message}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <ShimmerButton onClick={handleDownload} disabled={!mergedFileUrl}>
                    <span className="flex items-center space-x-2">
                      <Download className="w-5 h-5" />
                      <span>Download Complete</span>
                    </span>
                  </ShimmerButton>

                  <ShimmerButton variant="secondary" onClick={handleStartOver}>
                    <span className="flex items-center space-x-2">
                      <Upload className="w-5 h-5" />
                      <span>Process More Files</span>
                    </span>
                  </ShimmerButton>
                </div>
              </GlowingCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
