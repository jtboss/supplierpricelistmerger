import * as XLSX from 'xlsx'
import { 
  WorksheetAnalysis, 
  ColumnDetectionResult, 
  COST_COLUMN_PATTERNS,
  VALID_EXCEL_TYPES,
  MAX_FILE_SIZE 
} from '@/types'

/**
 * Excel Processor - Core class for handling Excel file operations
 * Built with Tesla-level reliability and performance standards
 */
export class ExcelProcessor {
  /**
   * Validates if a file is a supported Excel format
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!VALID_EXCEL_TYPES.includes(file.type as 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' | 'application/vnd.ms-excel')) {
      return {
        isValid: false,
        error: `Invalid file type. Please select an Excel file (.xlsx or .xls). Got: ${file.type}`,
      }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds maximum limit of ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB. Got: ${Math.round(file.size / (1024 * 1024))}MB`,
      }
    }

    // Check if file is empty
    if (file.size === 0) {
      return {
        isValid: false,
        error: 'File is empty',
      }
    }

    return { isValid: true }
  }

  /**
   * Reads Excel file and returns ArrayBuffer
   */
  static async readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        const result = event.target?.result
        if (result instanceof ArrayBuffer) {
          resolve(result)
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${reader.error?.message || 'Unknown error'}`))
      }
      
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * Parses Excel workbook from ArrayBuffer
   */
  static parseWorkbook(arrayBuffer: ArrayBuffer): XLSX.WorkBook {
    try {
      return XLSX.read(arrayBuffer, { 
        type: 'array',
        cellText: false,
        cellNF: false,
        cellHTML: false,
        cellFormula: false,
        sheetStubs: true,
        bookProps: true,
        bookSheets: true,
        bookVBA: false,
      })
    } catch (error) {
      throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Analyzes worksheet structure and content
   */
  static analyzeWorksheet(worksheet: XLSX.WorkSheet): WorksheetAnalysis {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1')
    
    // Find header row (usually first row with content)
    let headerRow = 0
    let hasHeaders = false
    
    // Check if first row contains mostly text (likely headers)
    const firstRowCells: unknown[] = []
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
      const cell = worksheet[cellAddress]
      if (cell && cell.v) {
        firstRowCells.push(cell.v)
      }
    }
    
    // If first row has mostly strings, it's likely headers
    const stringCount = firstRowCells.filter(cell => typeof cell === 'string').length
    hasHeaders = stringCount > firstRowCells.length * 0.5
    
    if (hasHeaders) {
      headerRow = 0
    }

    // Analyze column types
    const columnTypes: string[] = []
    for (let col = range.s.c; col <= range.e.c; col++) {
      let numCount = 0
      let strCount = 0
      let totalCount = 0
      
      // Sample cells in this column (skip header row)
      const startRow = hasHeaders ? 1 : 0
      for (let row = startRow; row <= Math.min(startRow + 100, range.e.r); row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
        const cell = worksheet[cellAddress]
        if (cell && cell.v !== undefined && cell.v !== null && cell.v !== '') {
          totalCount++
          if (typeof cell.v === 'number' || !isNaN(Number(cell.v))) {
            numCount++
          } else {
            strCount++
          }
        }
      }
      
      if (totalCount === 0) {
        columnTypes.push('empty')
      } else if (numCount > totalCount * 0.7) {
        columnTypes.push('number')
      } else if (strCount > totalCount * 0.7) {
        columnTypes.push('string')
      } else {
        columnTypes.push('mixed')
      }
    }

    // Detect cost column
    const costColumnIndex = this.detectCostColumn(worksheet)

    return {
      hasHeaders,
      headerRow,
      dataRange: {
        startRow: hasHeaders ? 1 : 0,
        endRow: range.e.r,
        startCol: range.s.c,
        endCol: range.e.c,
      },
      columnTypes,
      costColumnIndex,
      totalRows: range.e.r + 1,
      totalCols: range.e.c + 1,
    }
  }

  /**
   * Smart cost column detection using multiple strategies
   */
  static detectCostColumn(worksheet: XLSX.WorkSheet): number {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1')
    const results: ColumnDetectionResult[] = []

    // Get headers from first row
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
      const cell = worksheet[cellAddress]
      
      if (cell && cell.v && typeof cell.v === 'string') {
        const header = cell.v.toString().trim()
        
        // Test against each pattern
        for (const pattern of COST_COLUMN_PATTERNS) {
          if (pattern.test(header)) {
            // Calculate confidence based on pattern specificity
            let confidence = 0.5
            
            if (header.toLowerCase() === 'cost') confidence = 0.95
            else if (header.toLowerCase() === 'price') confidence = 0.9
            else if (header.toLowerCase().includes('cost price')) confidence = 0.9
            else if (header.toLowerCase().includes('unit price')) confidence = 0.85
            else confidence = 0.7
            
            results.push({
              columnIndex: col,
              confidence,
              columnName: header,
              pattern: pattern.source,
            })
            break
          }
        }
      }
    }

    // Sort by confidence and return best match
    results.sort((a, b) => b.confidence - a.confidence)
    
    return results.length > 0 ? results[0].columnIndex : -1
  }

  /**
   * Extracts data from worksheet as 2D array
   */
  static extractWorksheetData(worksheet: XLSX.WorkSheet): unknown[][] {
    try {
      return XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        blankrows: false,
        defval: '',
      }) as unknown[][]
    } catch (error) {
      throw new Error(`Failed to extract worksheet data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Gets header row from worksheet
   */
  static getHeaders(worksheet: XLSX.WorkSheet): string[] {
    const data = this.extractWorksheetData(worksheet)
    return data.length > 0 ? data[0].map(cell => cell?.toString() || '') : []
  }

  /**
   * Complete file processing pipeline
   */
  static async processFile(file: File): Promise<{
    workbook: XLSX.WorkBook
    analysis: WorksheetAnalysis
    headers: string[]
    data: unknown[][]
  }> {
    // Validate file
    const validation = this.validateFile(file)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }

    // Read and parse file
    const arrayBuffer = await this.readFile(file)
    const workbook = this.parseWorkbook(arrayBuffer)

    // Get first worksheet
    const firstSheetName = workbook.SheetNames[0]
    if (!firstSheetName) {
      throw new Error('No worksheets found in file')
    }

    const worksheet = workbook.Sheets[firstSheetName]
    if (!worksheet) {
      throw new Error('Failed to access worksheet')
    }

    // Analyze worksheet
    const analysis = this.analyzeWorksheet(worksheet)
    const headers = this.getHeaders(worksheet)
    const data = this.extractWorksheetData(worksheet)

    return {
      workbook,
      analysis,
      headers,
      data,
    }
  }
} 