'use client'

import { FileObject } from '@/types'
import { formatFileSize } from '@/lib/utils'

interface ProcessingCenterProps {
  files: FileObject[]
  currentProgress: number
}

export function ProcessingCenter({ files, currentProgress }: ProcessingCenterProps) {
  const completedFiles = files.filter(f => f.status === 'completed').length
  const errorFiles = files.filter(f => f.status === 'error').length
  const processingFiles = files.filter(f => f.status === 'processing').length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overall Progress */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Processing Your Files
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            {completedFiles} of {files.length} files completed
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Overall Progress
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {Math.round(currentProgress)}%
            </span>
          </div>
          
          <div className="relative h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, currentProgress))}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {completedFiles}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Completed
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {processingFiles}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Processing
            </div>
          </div>
          
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {errorFiles}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">
              Errors
            </div>
          </div>
        </div>
      </div>

      {/* Individual File Status */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          File Status
        </h3>
        
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                {/* Status Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  file.status === 'completed' 
                    ? 'bg-green-500' 
                    : file.status === 'error'
                    ? 'bg-red-500'
                    : file.status === 'processing'
                    ? 'bg-blue-500'
                    : 'bg-slate-400'
                }`}>
                  {file.status === 'completed' && (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {file.status === 'error' && (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {file.status === 'processing' && (
                    <svg className="w-5 h-5 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  {file.status === 'pending' && (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>

                {/* File Info */}
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-100">
                    {file.name}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {formatFileSize(file.size)}
                    {file.costColumnIndex !== -1 && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                        Cost column detected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Text */}
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  file.status === 'completed' 
                    ? 'text-green-600 dark:text-green-400' 
                    : file.status === 'error'
                    ? 'text-red-600 dark:text-red-400'
                    : file.status === 'processing'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {getStatusText(file.status)}
                </div>
                {file.errors.length > 0 && (
                  <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {file.errors[0]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getStatusText(status: FileObject['status']): string {
  switch (status) {
    case 'pending':
      return 'Waiting...'
    case 'processing':
      return 'Processing...'
    case 'completed':
      return 'Completed'
    case 'error':
      return 'Error'
    default:
      return 'Unknown'
  }
}