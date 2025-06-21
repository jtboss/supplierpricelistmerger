'use client'

import { CompletionSection } from '@/components/CompletionSection'
import { ErrorDisplay } from '@/components/ErrorDisplay'
import { FileUpload } from '@/components/FileUpload'
import { PreviewSection } from '@/components/PreviewSection'
import { ProcessingCenter } from '@/components/ProcessingCenter'
import { ProgressIndicator } from '@/components/ProgressIndicator'
import { MasterWorkbookGenerator } from '@/lib/excel/masterWorkbook'
import { ExcelProcessor } from '@/lib/excel/processor'
import { generateId } from '@/lib/utils'
import { AppError, AppState, FileObject, ProcessedFileData } from '@/types'
import { useCallback, useState } from 'react'

export default function SupplierMerger() {
  const [appState, setAppState] = useState<AppState>({
    uploadedFiles: [],
    processedData: {},
    currentProgress: 0,
    errors: [],
    isProcessing: false,
    masterWorkbook: null,
    uiState: 'idle'
  })

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newFiles: FileObject[] = files.map(file => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      costColumnIndex: -1,
      errors: [],
      status: 'pending'
    }))

    setAppState(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...newFiles],
      uiState: 'uploading'
    }))

    // Process files immediately after upload
    await processFiles(newFiles)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const processFiles = useCallback(async (files: FileObject[]) => {
    setAppState(prev => ({ ...prev, isProcessing: true, uiState: 'processing' }))

    try {
      const processedFiles: FileObject[] = []
      const processedData: Record<string, ProcessedFileData> = {}

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const progress = ((i + 1) / files.length) * 100

        setAppState(prev => ({
          ...prev,
          currentProgress: progress
        }))

        try {
          // Process individual file
          console.log(`Processing file: ${file.name}`)
          const result = await ExcelProcessor.processFile(file.file)

          const processedFile: FileObject = {
            ...file,
            workbook: result.workbook,
            costColumnIndex: result.analysis.costColumnIndex,
            status: 'completed'
          }

          processedFiles.push(processedFile)
          processedData[file.id] = {
            headers: result.headers,
            data: result.data,
            analysis: result.analysis
          }

          console.log(`Successfully processed file: ${file.name}`)

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

          processedFiles.push({
            ...file,
            status: 'error',
            errors: [errorMessage]
          })

          setAppState(prev => ({
            ...prev,
            errors: [...prev.errors, errorObj]
          }))
        }
      }

      // Generate master workbook
      const masterWorkbook = await MasterWorkbookGenerator.generateMasterWorkbook(processedFiles)

      setAppState(prev => ({
        ...prev,
        uploadedFiles: processedFiles,
        processedData,
        masterWorkbook,
        isProcessing: false,
        currentProgress: 100,
        uiState: 'complete'
      }))

    } catch (err) {
      const errorObj: AppError = {
        id: generateId(),
        type: 'PROCESSING_ERROR',
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        timestamp: new Date(),
        severity: 'critical'
      }

      setAppState(prev => ({
        ...prev,
        errors: [...prev.errors, errorObj],
        isProcessing: false,
        uiState: 'error'
      }))
    }
  }, [])

  const handleDownload = useCallback(() => {
    if (!appState.masterWorkbook) return

    try {
      MasterWorkbookGenerator.downloadMasterWorkbook(appState.masterWorkbook)
    } catch {
      const errorObj: AppError = {
        id: generateId(),
        type: 'PROCESSING_ERROR',
        message: 'Failed to download file',
        timestamp: new Date(),
        severity: 'medium'
      }

      setAppState(prev => ({
        ...prev,
        errors: [...prev.errors, errorObj]
      }))
    }
  }, [appState.masterWorkbook])

  const handleReset = useCallback(() => {
    setAppState({
      uploadedFiles: [],
      processedData: {},
      currentProgress: 0,
      errors: [],
      isProcessing: false,
      masterWorkbook: null,
      uiState: 'idle'
    })
  }, [])

  const handleErrorDismiss = useCallback((errorId: string) => {
    setAppState(prev => ({
      ...prev,
      errors: prev.errors.filter(error => error.id !== errorId)
    }))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Supplier Price List Merger
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tesla-level precision. Jony Ive-inspired design.
                </p>
              </div>
            </div>

            {appState.uiState === 'complete' && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {appState.errors.length > 0 && (
          <div className="mb-6">
            <ErrorDisplay
              errors={appState.errors}
              onDismiss={handleErrorDismiss}
            />
          </div>
        )}

        {/* Progress Indicator */}
        {appState.isProcessing && (
          <div className="mb-8">
            <ProgressIndicator
              progress={appState.currentProgress}
              message="Processing your supplier files..."
              stage="processing"
            />
          </div>
        )}

        {/* Main Content Based on UI State */}
        {appState.uiState === 'idle' && (
          <div className="text-center space-y-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Transform Your Supplier Price Lists
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Upload multiple Excel files from your suppliers. We&apos;ll automatically detect cost columns and add markup calculations with precision engineering.
              </p>
            </div>

            <FileUpload
              onFilesSelected={handleFilesSelected}
              disabled={appState.isProcessing}
            />
          </div>
        )}

        {(appState.uiState === 'uploading' || appState.uiState === 'processing') && (
          <ProcessingCenter
            files={appState.uploadedFiles}
            currentProgress={appState.currentProgress}
          />
        )}

        {appState.uiState === 'complete' && (
          <div className="space-y-8">
            <PreviewSection
              files={appState.uploadedFiles}
              processedData={appState.processedData}
            />

            <CompletionSection
              masterWorkbook={appState.masterWorkbook}
              onDownload={handleDownload}
              fileCount={appState.uploadedFiles.length}
            />
          </div>
        )}

        {appState.uiState === 'error' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Processing Failed
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              We encountered an error while processing your files. Please try again.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
