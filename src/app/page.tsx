'use client'

import { BackgroundBeams } from '@/components/ui/background-beams'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { EnhancedDropZone } from '@/components/ui/enhanced-drop-zone'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { MasterWorkbookGenerator } from '@/lib/excel/masterWorkbook'
import { ExcelProcessor } from '@/lib/excel/processor'
import { generateId } from '@/lib/utils'
import { AppError, FileObject } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, FileCheck, FileSpreadsheet, Shield, Sparkles, TrendingUp, Upload, X, Zap } from 'lucide-react'
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

export default function EnhancedPage() {
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

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Advanced algorithms for rapid Excel analysis and processing"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Processing",
      description: "Your data never leaves your browser - complete privacy"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Smart Markup",
      description: "AI-powered cost column detection and markup calculations"
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden aurora-background">
      {/* Background Effects */}
      <BackgroundBeams className="opacity-40" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Header */}
        <header className="text-center mb-16">
          <motion.div
            className="floating flex items-center justify-center w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-10 h-10 text-primary" />
          </motion.div>

          <TextGenerateEffect
            words="Supplier Price List Merger"
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
          />

          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Transform your supplier data with intelligent markup calculations.
            <br />
            <span className="text-primary font-semibold">Professional-grade processing meets beautiful design.</span>
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {appState === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <EnhancedDropZone
                onFilesSelected={handleFilesSelected}
                acceptedTypes={['.xlsx', '.xls', '.csv']}
                maxFiles={10}
                title="Upload your supplier files"
                subtitle="Drag and drop Excel or CSV files, or click to browse"
              />

              {files.length > 0 && (
                <SpotlightCard className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-foreground">
                      Selected Files ({files.length})
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-sm text-muted-foreground">Ready to process</span>
                    </div>
                  </div>

                  <div className="grid gap-4 mb-8">
                    {files.map((file, index) => (
                      <motion.div
                        key={file.id}
                        className="flex items-center justify-between p-4 rounded-xl enhanced-card hover-lift"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <FileSpreadsheet className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for processing
                            </p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleRemoveFile(file.id)}
                          className="p-2 hover:bg-destructive/10 rounded-full text-destructive transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <EnhancedButton
                      variant="glow"
                      size="lg"
                      onClick={handleMergeFiles}
                      className="px-12"
                    >
                      <span className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5" />
                        Process {files.length} Files
                      </span>
                    </EnhancedButton>
                  </div>
                </SpotlightCard>
              )}

              {/* Features Section */}
              <motion.div
                className="grid md:grid-cols-3 gap-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.2 }}
                  >
                    <SpotlightCard className="text-center p-8 h-full">
                      <div className="floating flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </SpotlightCard>
                  </motion.div>
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
              <SpotlightCard className="text-center p-12">
                <motion.div
                  className="floating w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Upload className="w-12 h-12 text-primary" />
                </motion.div>

                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Processing Files...
                </h2>

                <p className="text-lg text-muted-foreground mb-8">
                  {currentProcessingStep}
                </p>

                <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${processingProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  {Math.round(processingProgress)}% Complete
                </p>
              </SpotlightCard>
            </motion.div>
          )}

          {appState === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <SpotlightCard className="text-center p-12">
                <motion.div
                  className="floating w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <FileCheck className="w-12 h-12 text-green-500" />
                </motion.div>

                <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
                  Processing Complete!
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Your supplier data has been intelligently processed with markup calculations.
                </p>

                {files.filter(f => f.costColumnIndex !== undefined && f.costColumnIndex !== -1).length > 0 && (
                  <motion.div
                    className="enhanced-card p-6 mb-8 border-green-500/20 bg-green-50/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="font-semibold text-green-600 mb-2">
                      ✨ Markup Columns Added
                    </h3>
                    <p className="text-sm text-green-600/80">
                      Successfully added 5%, 10%, 15%, 20%, and 30% markup columns to {files.filter(f => f.costColumnIndex !== undefined && f.costColumnIndex !== -1).length} files
                    </p>
                  </motion.div>
                )}

                {errors.length > 0 && (
                  <motion.div
                    className="enhanced-card p-6 mb-8 border-red-500/20 bg-red-50/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="font-semibold text-red-600 mb-2">
                      Processing Errors
                    </h3>
                    <ul className="text-sm text-red-600/80 text-left space-y-1">
                      {errors.map(error => (
                        <li key={error.id}>• {error.message}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <EnhancedButton
                    variant="glow"
                    onClick={handleDownload}
                    disabled={!mergedFileUrl}
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Download Results
                    </span>
                  </EnhancedButton>

                  <EnhancedButton
                    variant="moving"
                    onClick={handleStartOver}
                  >
                    <span className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Process More Files
                    </span>
                  </EnhancedButton>
                </div>
              </SpotlightCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
