// Core application types for Supplier Price List Merger
import * as XLSX from 'xlsx'

export interface FileObject {
  id: string
  name: string
  size: number
  type: string
  file: File
  workbook?: XLSX.WorkBook
  costColumnIndex: number
  errors: string[]
  status: FileStatus
}

export type FileStatus = 'pending' | 'processing' | 'completed' | 'error'

export interface ProcessedFileData {
  headers: string[]
  data: unknown[][]
  analysis: WorksheetAnalysis
}

export interface AppState {
  uploadedFiles: FileObject[]
  processedData: Record<string, ProcessedFileData>
  currentProgress: number
  errors: AppError[]
  isProcessing: boolean
  masterWorkbook: XLSX.WorkBook | null
  uiState: UIState
}

export type UIState = 'idle' | 'uploading' | 'processing' | 'preview' | 'complete' | 'error'

export interface AppError {
  id: string
  type: ErrorType
  message: string
  fileId?: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export type ErrorType = 
  | 'FILE_TOO_LARGE'
  | 'INVALID_FORMAT'
  | 'CORRUPTED_FILE'
  | 'NO_COST_COLUMN'
  | 'EMPTY_FILE'
  | 'PROCESSING_ERROR'
  | 'MEMORY_ERROR'
  | 'NETWORK_ERROR'

export interface MarkupConfig {
  percentages: number[]
  labels: string[]
  precision: number
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface ProcessingProgress {
  fileId: string
  fileName: string
  stage: ProcessingStage
  progress: number
  message: string
}

export type ProcessingStage = 
  | 'reading'
  | 'parsing'
  | 'analyzing'
  | 'calculating'
  | 'generating'
  | 'processing'
  | 'complete'

export interface ColumnDetectionResult {
  columnIndex: number
  confidence: number
  columnName: string
  pattern: string
}

export interface WorksheetAnalysis {
  hasHeaders: boolean
  headerRow: number
  dataRange: {
    startRow: number
    endRow: number
    startCol: number
    endCol: number
  }
  columnTypes: string[]
  costColumnIndex: number
  totalRows: number
  totalCols: number
}

export interface CalculationResult {
  originalValue: number
  markupValues: number[]
  errors: string[]
}

// UI Component Props
export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  maxFileSize?: number
  acceptedTypes?: string[]
  multiple?: boolean
  disabled?: boolean
}

export interface ProgressIndicatorProps {
  progress: number
  message?: string
  stage?: ProcessingStage
  fileName?: string
}

export interface ErrorDisplayProps {
  errors: AppError[]
  onDismiss?: (errorId: string) => void
  onRetry?: (errorId: string) => void
}

export interface PreviewTableProps {
  data: unknown[][]
  headers: string[]
  maxRows?: number
  fileName: string
}

// Constants
export const MARKUP_PERCENTAGES = [0.05, 0.10, 0.15, 0.20, 0.30] as const
export const MARKUP_LABELS = ['5% Markup', '10% Markup', '15% Markup', '20% Markup', '30% Markup'] as const

export const COST_COLUMN_PATTERNS = [
  /^cost$/i,
  /^price$/i,
  /^cost[\s_]?price$/i,
  /^unit[\s_]?price$/i,
  /^selling[\s_]?price$/i,
  /^wholesale[\s_]?price$/i,
  /^supplier[\s_]?price$/i,
  /^base[\s_]?price$/i,
] as const

export const VALID_EXCEL_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
] as const

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const MAX_FILES = 100

// Performance monitoring types
export interface PerformanceMetrics {
  loadTime: number
  fileUploadTime: number
  processingTime: number
  memoryUsage: number
  errorRate: number
} 