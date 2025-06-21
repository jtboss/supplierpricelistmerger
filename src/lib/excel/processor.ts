import {
  ColumnDetectionResult,
  COST_COLUMN_PATTERNS,
  MAX_FILE_SIZE,
  WorksheetAnalysis
} from '@/types';
import * as XLSX from 'xlsx';

/**
 * Excel Processor - Core class for handling Excel file operations
 * Built with Tesla-level reliability and performance standards
 */
export class ExcelProcessor {
  /**
   * Validates if a file is a supported Excel format
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    console.log(`Validating file: ${file.name}`)
    console.log(`File size: ${file.size} bytes`)
    console.log(`File type: ${file.type}`)

    // Check if file is empty
    if (file.size === 0) {
      return {
        isValid: false,
        error: 'File is empty',
      }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds maximum limit of ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB. Got: ${Math.round(file.size / (1024 * 1024))}MB`,
      }
    }

    // Check file extension (more lenient than MIME type)
    const fileName = file.name.toLowerCase()
    const hasValidExtension = fileName.endsWith('.xlsx') || fileName.endsWith('.xls')

    if (!hasValidExtension) {
      return {
        isValid: false,
        error: `Invalid file extension. Please select an Excel file (.xlsx or .xls). Got: ${file.name}`,
      }
    }

    // Check file type (but be more lenient)
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/octet-stream', // Sometimes Excel files are detected as this
      'application/x-excel',
      'application/x-msexcel',
    ]

    if (file.type && !validTypes.includes(file.type)) {
      console.warn(`Unexpected MIME type: ${file.type}, but proceeding due to valid extension`)
    }

    console.log('File validation passed')
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
   * Parses Excel workbook from ArrayBuffer with multiple fallback strategies
   */
  static parseWorkbook(arrayBuffer: ArrayBuffer): XLSX.WorkBook {
    const parseStrategies = [
      // Strategy 1: Standard parsing with minimal options
      () => XLSX.read(arrayBuffer, {
        type: 'array',
        cellText: false,
        cellNF: false,
        cellHTML: false,
        cellFormula: false,
      }),

      // Strategy 2: More permissive parsing
      () => XLSX.read(arrayBuffer, {
        type: 'array',
        cellText: true,
        cellNF: true,
        cellHTML: false,
        cellFormula: true,
        sheetStubs: true,
        bookProps: false,
        bookSheets: false,
        bookVBA: false,
        password: undefined,
      }),

      // Strategy 3: Very permissive parsing
      () => XLSX.read(arrayBuffer, {
        type: 'array',
        raw: true,
        codepage: 65001, // UTF-8
      }),

      // Strategy 4: Binary parsing as fallback
      () => XLSX.read(new Uint8Array(arrayBuffer), {
        type: 'array',
      }),
    ]

    let lastError: Error | null = null

    for (let i = 0; i < parseStrategies.length; i++) {
      try {
        console.log(`Trying parsing strategy ${i + 1}...`)
        const workbook = parseStrategies[i]()

        // Log what we got
        console.log('Workbook parsed successfully!')
        console.log('SheetNames:', workbook.SheetNames)
        console.log('Sheets object exists:', !!workbook.Sheets)
        console.log('Sheets keys:', workbook.Sheets ? Object.keys(workbook.Sheets) : 'No Sheets object')

        // Validate basic structure
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('No worksheets found in the Excel file')
        }

        // If Sheets object is missing, try to create it
        if (!workbook.Sheets) {
          console.log('Sheets object missing, attempting to reconstruct...')
          workbook.Sheets = {}

          // Try to read each sheet individually
          for (const sheetName of workbook.SheetNames) {
            try {
              // This is a fallback - create empty sheet structure
              workbook.Sheets[sheetName] = {
                '!ref': 'A1:A1'
              }
            } catch (sheetError) {
              console.warn(`Could not create sheet ${sheetName}:`, sheetError)
            }
          }
        }

        // Final validation
        if (!workbook.Sheets || Object.keys(workbook.Sheets).length === 0) {
          throw new Error(`No accessible worksheets found. Available sheet names: ${workbook.SheetNames.join(', ')}`)
        }

        console.log(`Successfully parsed workbook with strategy ${i + 1}`)
        return workbook

      } catch (error) {
        lastError = error as Error
        console.log(`Strategy ${i + 1} failed:`, error)
        continue
      }
    }

    // If all strategies failed
    throw new Error(`Failed to parse Excel file after trying all strategies. Last error: ${lastError?.message || 'Unknown error'}`)
  }

  /**
   * Analyzes worksheet structure and content
   */
  static analyzeWorksheet(worksheet: XLSX.WorkSheet): WorksheetAnalysis {
    // Check if worksheet exists and has content
    if (!worksheet || !worksheet['!ref']) {
      throw new Error('Worksheet is empty or invalid')
    }

    const range = XLSX.utils.decode_range(worksheet['!ref'])

    // Check if range is valid
    if (range.e.r < range.s.r || range.e.c < range.s.c) {
      throw new Error('Invalid worksheet range detected')
    }

    // Find header row (usually first row with content)
    let headerRow = 0
    let hasHeaders = false

    // Check if first row contains mostly text (likely headers)
    const firstRowCells: unknown[] = []
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
      const cell = worksheet[cellAddress]
      if (cell && cell.v !== undefined && cell.v !== null) {
        firstRowCells.push(cell.v)
      }
    }

    // If first row has mostly strings, it's likely headers
    const stringCount = firstRowCells.filter(cell => typeof cell === 'string').length
    hasHeaders = stringCount > firstRowCells.length * 0.5 && firstRowCells.length > 0

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
    if (!worksheet || !worksheet['!ref']) {
      return -1
    }

    const range = XLSX.utils.decode_range(worksheet['!ref'])
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
            break // Only use first matching pattern per column
          }
        }
      }
    }

    // Return column with highest confidence, or -1 if none found
    if (results.length === 0) return -1

    const bestMatch = results.reduce((best, current) =>
      current.confidence > best.confidence ? current : best
    )

    return bestMatch.columnIndex
  }

  /**
   * Extract data from worksheet as 2D array
   */
  static extractWorksheetData(worksheet: XLSX.WorkSheet): unknown[][] {
    if (!worksheet || !worksheet['!ref']) {
      return []
    }

    try {
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        blankrows: false,
      })

      return jsonData as unknown[][]
    } catch (error) {
      console.error('Error extracting worksheet data:', error)
      return []
    }
  }

  /**
   * Get headers from worksheet
   */
  static getHeaders(worksheet: XLSX.WorkSheet): string[] {
    if (!worksheet || !worksheet['!ref']) {
      return []
    }

    const range = XLSX.utils.decode_range(worksheet['!ref'])
    const headers: string[] = []

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
      const cell = worksheet[cellAddress]

      if (cell && cell.v) {
        headers.push(cell.v.toString())
      } else {
        headers.push(`Column ${col + 1}`)
      }
    }

    return headers
  }

  /**
   * Diagnostic function to understand file structure
   */
  static async diagnoseFile(file: File): Promise<void> {
    try {
      console.log('=== FILE DIAGNOSIS ===')
      console.log('File name:', file.name)
      console.log('File size:', file.size, 'bytes')
      console.log('File type:', file.type)
      console.log('Last modified:', file.lastModified)

      // Read first few bytes to check file signature
      const arrayBuffer = await this.readFile(file)
      const bytes = new Uint8Array(arrayBuffer.slice(0, 16))
      const hexString = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join(' ')
      console.log('File signature (first 16 bytes):', hexString)

      // Check for common Excel signatures
      const bytesArray = Array.from(bytes)
      if (bytesArray[0] === 0x50 && bytesArray[1] === 0x4B) {
        console.log('✓ Detected ZIP-based format (likely .xlsx)')
      } else if (bytesArray[0] === 0xD0 && bytesArray[1] === 0xCF) {
        console.log('✓ Detected OLE2/CFB format (likely .xls)')
      } else {
        console.log('⚠ Unknown file format signature')
      }

      console.log('=== END DIAGNOSIS ===')
    } catch (error) {
      console.error('File diagnosis failed:', error)
    }
  }

  /**
   * Process a single Excel file and return analysis
   */
  static async processFile(file: File): Promise<{
    workbook: XLSX.WorkBook
    analysis: WorksheetAnalysis
    headers: string[]
    data: unknown[][]
  }> {
    try {
      // Run diagnostics first
      await this.diagnoseFile(file)

      // Validate file
      const validation = this.validateFile(file)
      if (!validation.isValid) {
        throw new Error(validation.error || 'File validation failed')
      }

      // Read and parse file
      const arrayBuffer = await this.readFile(file)
      const workbook = this.parseWorkbook(arrayBuffer)

      // Get first worksheet (try multiple approaches)
      const firstSheetName = workbook.SheetNames[0]
      console.log(`Trying to access worksheet: "${firstSheetName}"`)

      let worksheet = workbook.Sheets[firstSheetName]

      // If direct access failed, try to find the worksheet by iterating through Sheets
      if (!worksheet) {
        console.log('Direct worksheet access failed, trying alternative approaches...')
        const availableSheets = Object.keys(workbook.Sheets)
        console.log('Available sheet keys:', availableSheets)

        // Try to find a matching sheet (case-insensitive)
        const matchingSheet = availableSheets.find(key =>
          key.toLowerCase() === firstSheetName.toLowerCase()
        )

        if (matchingSheet) {
          worksheet = workbook.Sheets[matchingSheet]
          console.log(`Found worksheet using case-insensitive match: "${matchingSheet}"`)
        } else {
          // Use the first available sheet
          const firstAvailableKey = availableSheets[0]
          if (firstAvailableKey) {
            worksheet = workbook.Sheets[firstAvailableKey]
            console.log(`Using first available worksheet: "${firstAvailableKey}"`)
          }
        }
      }

      if (!worksheet) {
        throw new Error(`Could not access any worksheet in the file. Available sheets: ${Object.keys(workbook.Sheets).join(', ')}`)
      }

      // Analyze worksheet
      const analysis = this.analyzeWorksheet(worksheet)
      const headers = this.getHeaders(worksheet)
      const data = this.extractWorksheetData(worksheet)

      // Validate we have some data
      if (data.length === 0) {
        throw new Error('No data found in the worksheet')
      }

      console.log(`Successfully processed file: ${file.name} with ${data.length} rows`)

      return {
        workbook,
        analysis,
        headers,
        data,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error processing file'
      throw new Error(`Error processing "${file.name}": ${errorMessage}`)
    }
  }
} 