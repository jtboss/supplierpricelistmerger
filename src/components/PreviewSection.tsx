'use client'

import { FileObject, ProcessedFileData } from '@/types'
import { formatFileSize } from '@/lib/utils'

interface PreviewSectionProps {
  files: FileObject[]
  processedData: Record<string, ProcessedFileData>
}

export function PreviewSection({ files, processedData }: PreviewSectionProps) {
  const completedFiles = files.filter(f => f.status === 'completed')

  if (completedFiles.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Processing Complete
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Preview of your processed supplier data with markup calculations
        </p>
      </div>

      {/* Files Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Processed Files Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedFiles.map((file) => {
            const data = processedData[file.id]
            
            return (
              <div
                key={file.id}
                className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800 dark:text-slate-100 text-sm leading-tight">
                      {file.name.replace(/\.(xlsx|xls)$/i, '')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ml-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {data && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Rows:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {data.data ? data.data.length : 0}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Columns:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {data.headers ? data.headers.length + 5 : 0}
                      </span>
                    </div>
                    
                    {file.costColumnIndex !== -1 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Markup columns added</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Sample Data Preview */}
      {completedFiles.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Sample Data Preview
          </h3>
          
          <div className="space-y-6">
            {completedFiles.slice(0, 2).map((file) => {
              const data = processedData[file.id]
              
              if (!data || !data.headers || !data.data) {
                return null
              }

              const sampleRows = data.data.slice(0, 5) // Show first 5 rows
              const allHeaders = [
                ...data.headers,
                '5% Markup',
                '10% Markup', 
                '15% Markup',
                '20% Markup',
                '30% Markup'
              ]

              return (
                <div key={file.id}>
                  <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">
                    {file.name.replace(/\.(xlsx|xls)$/i, '')}
                  </h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-slate-200 dark:border-slate-600">
                          {allHeaders.map((header, index) => (
                            <th
                              key={index}
                              className={`text-left p-3 font-medium text-slate-700 dark:text-slate-300 ${
                                index >= data.headers.length 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                                  : ''
                              }`}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sampleRows.map((row: unknown[], rowIndex: number) => (
                          <tr
                            key={rowIndex}
                            className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          >
                                                         {allHeaders.map((_, colIndex) => {
                               const isMarkupColumn = colIndex >= data.headers.length
                               const cellValue = isMarkupColumn ? '(calculated)' : String(row[colIndex] || '')
                               
                               return (
                                 <td
                                   key={colIndex}
                                   className={`p-3 text-slate-600 dark:text-slate-300 ${
                                     isMarkupColumn 
                                       ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-medium' 
                                       : ''
                                   }`}
                                 >
                                   {cellValue}
                                 </td>
                               )
                             })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {data.data.length > 5 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 text-center">
                      Showing 5 of {data.data.length} rows
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}