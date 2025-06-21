'use client'

import * as XLSX from 'xlsx'

interface CompletionSectionProps {
  masterWorkbook: XLSX.WorkBook | null
  onDownload: () => void
  fileCount: number
}

export function CompletionSection({ masterWorkbook, onDownload, fileCount }: CompletionSectionProps) {
  if (!masterWorkbook) {
    return null
  }

  return (
    <div className="text-center space-y-8">
      {/* Success Animation */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Celebration particles */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="absolute -top-1 -right-3 w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute -bottom-2 -left-1 w-5 h-5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -bottom-1 -right-2 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }}></div>
        </div>
      </div>

      {/* Success Message */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          🎉 Mission Accomplished!
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
          Your {fileCount} supplier price list{fileCount !== 1 ? 's have' : ' has'} been successfully merged with 
          Tesla-level precision. All markup calculations are ready for download.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {fileCount}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Files Processed
            </div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              5
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Markup Columns Added
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              100%
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">
              Data Preserved
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border-2 border-dashed border-blue-200 dark:border-blue-700">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Download Master Workbook
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Your complete supplier price list with markup calculations is ready for download.
          </p>
          
          <button
            onClick={onDownload}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Excel File</span>
          </button>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            File will be saved as: Supplier_Master_[timestamp].xlsx
          </p>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 text-left">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 text-center">
          What&apos;s Included in Your Master Workbook
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                All original supplier data preserved
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                5%, 10%, 15%, 20%, 30% markup columns
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Separate worksheet for each supplier
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Precision calculations to 2 decimal places
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Clean formatting and proper column headers
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Ready for immediate business use
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}