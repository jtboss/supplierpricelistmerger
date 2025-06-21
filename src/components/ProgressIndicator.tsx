'use client'

import { ProgressIndicatorProps, ProcessingStage } from '@/types'

const stageMessages: Record<ProcessingStage, string> = {
  reading: 'Reading Excel files...',
  parsing: 'Parsing spreadsheet data...',
  analyzing: 'Analyzing column structure...',
  calculating: 'Calculating markup values...',
  generating: 'Generating master workbook...',
  processing: 'Processing files...',
  complete: 'Processing complete!'
}

const stageIcons: Record<ProcessingStage, string> = {
  reading: 'M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2M7 4H5a2 2 0 00-2 2v9a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2h-2M7 4h6',
  parsing: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 01-2 2H9',
  analyzing: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  calculating: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  generating: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  processing: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  complete: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
}

export function ProgressIndicator({ 
  progress, 
  message, 
  stage = 'processing',
  fileName 
}: ProgressIndicatorProps) {
  const displayMessage = message || stageMessages[stage] || 'Processing...'
  const currentIcon = stageIcons[stage]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="max-w-md mx-auto text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={currentIcon} />
            </svg>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Progress
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-slate-800 dark:text-slate-100">
            {displayMessage}
          </p>
          
          {fileName && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Currently processing: <span className="font-medium">{fileName}</span>
            </p>
          )}
          
          {stage === 'complete' && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                All files processed successfully!
              </p>
            </div>
          )}
        </div>

        {/* Processing Stages Indicator */}
        <div className="mt-8 flex justify-center space-x-2">
          {(['reading', 'parsing', 'analyzing', 'calculating', 'generating'] as ProcessingStage[]).map((stageName, index) => {
            const isActive = stageName === stage
            const isCompleted = ['reading', 'parsing', 'analyzing', 'calculating', 'generating'].indexOf(stage) > index
            
            return (
              <div
                key={stageName}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-500 scale-125' 
                    : isCompleted 
                    ? 'bg-green-500' 
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}