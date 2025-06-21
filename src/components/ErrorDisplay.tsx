'use client'

import { ErrorDisplayProps, ErrorType } from '@/types'

const errorIcons: Record<ErrorType, string> = {
  FILE_TOO_LARGE: 'M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2M7 4L5 6v10a2 2 0 002 2h6a2 2 0 002-2V6l-2-2M7 4h6M10 11V8h4v3M10 11h4',
  INVALID_FORMAT: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
  CORRUPTED_FILE: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  NO_COST_COLUMN: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  EMPTY_FILE: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  PROCESSING_ERROR: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
  MEMORY_ERROR: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  NETWORK_ERROR: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
}

const severityColors = {
  low: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  medium: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  high: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
  critical: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
}

const severityIconColors = {
  low: 'text-blue-500 dark:text-blue-400',
  medium: 'text-yellow-500 dark:text-yellow-400',
  high: 'text-orange-500 dark:text-orange-400',
  critical: 'text-red-500 dark:text-red-400'
}

const severityTextColors = {
  low: 'text-blue-800 dark:text-blue-200',
  medium: 'text-yellow-800 dark:text-yellow-200',
  high: 'text-orange-800 dark:text-orange-200',
  critical: 'text-red-800 dark:text-red-200'
}

export function ErrorDisplay({ errors, onDismiss, onRetry }: ErrorDisplayProps) {
  if (errors.length === 0) return null

  return (
    <div className="space-y-4">
      {errors.map((error) => (
        <div
          key={error.id}
          className={`rounded-xl border-2 p-4 ${severityColors[error.severity]}`}
        >
          <div className="flex items-start">
            {/* Error Icon */}
            <div className={`flex-shrink-0 w-6 h-6 ${severityIconColors[error.severity]} mt-0.5`}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={errorIcons[error.type]}
                />
              </svg>
            </div>

            {/* Error Content */}
            <div className="ml-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`text-sm font-medium ${severityTextColors[error.severity]}`}>
                    {getErrorTitle(error.type)}
                  </h3>
                  <p className={`mt-1 text-sm ${severityTextColors[error.severity]} opacity-90`}>
                    {error.message}
                  </p>
                  {error.fileId && (
                    <p className={`mt-1 text-xs ${severityTextColors[error.severity]} opacity-75`}>
                      File ID: {error.fileId}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="ml-4 flex space-x-2">
                  {onRetry && error.severity !== 'critical' && (
                    <button
                      onClick={() => onRetry(error.id)}
                      className={`text-xs font-medium px-3 py-1 rounded-md hover:opacity-80 transition-opacity ${
                        error.severity === 'low' 
                          ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                          : error.severity === 'medium'
                          ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
                          : 'bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200'
                      }`}
                    >
                      Retry
                    </button>
                  )}
                  
                  {onDismiss && (
                    <button
                      onClick={() => onDismiss(error.id)}
                      className={`text-xs font-medium px-3 py-1 rounded-md hover:opacity-80 transition-opacity ${
                        error.severity === 'low' 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : error.severity === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                          : error.severity === 'high'
                          ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
                          : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                      }`}
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function getErrorTitle(type: ErrorType): string {
  const titles: Record<ErrorType, string> = {
    FILE_TOO_LARGE: 'File Too Large',
    INVALID_FORMAT: 'Invalid File Format',
    CORRUPTED_FILE: 'Corrupted File',
    NO_COST_COLUMN: 'No Cost Column Found',
    EMPTY_FILE: 'Empty File',
    PROCESSING_ERROR: 'Processing Error',
    MEMORY_ERROR: 'Memory Error',
    NETWORK_ERROR: 'Network Error'
  }
  
  return titles[type] || 'Unknown Error'
}