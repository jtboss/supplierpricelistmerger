import { isValidNumber } from '@/lib/utils'
import { FileObject, MARKUP_LABELS, MARKUP_PERCENTAGES } from '@/types'
import * as XLSX from 'xlsx'

/**
 * Master Workbook Generator - Tesla-level precision for Excel processing
 * Handles markup calculations and master workbook generation
 */
export class MasterWorkbookGenerator {
  /**
   * Calculate markup value with precision handling
   */
  static calculateMarkup(cost: number, markupPercentage: number): number | null {
    // Validate inputs
    if (!isValidNumber(cost) || !isValidNumber(markupPercentage)) {
      return null
    }

    if (cost < 0 || markupPercentage < 0) {
      return null
    }

    try {
      // Calculate markup with precision to 2 decimal places
      const markup = cost * (1 + markupPercentage)
      return Math.round(markup * 100) / 100
    } catch {
      return null
    }
  }

  /**
   * Add markup columns to a worksheet
   */
  static addMarkupColumns(worksheet: XLSX.WorkSheet, costColumnIndex: number): XLSX.WorkSheet {
    if (costColumnIndex === -1) {
      throw new Error('Cost column not found')
    }

    // Validate worksheet
    if (!worksheet || !worksheet['!ref']) {
      throw new Error('Invalid worksheet provided')
    }

    // Get worksheet range
    const range = XLSX.utils.decode_range(worksheet['!ref'])

    const newRange = {
      s: { r: range.s.r, c: range.s.c },
      e: { r: range.e.r, c: range.e.c + MARKUP_PERCENTAGES.length }
    }

    // Create new worksheet with existing data
    const newWorksheet: XLSX.WorkSheet = {}

    // Copy existing cells
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
        const cell = worksheet[cellAddress]
        if (cell) {
          newWorksheet[cellAddress] = { ...cell }
        }
      }
    }

    // Add markup column headers (first row)
    for (let i = 0; i < MARKUP_LABELS.length; i++) {
      const newCol = range.e.c + 1 + i
      const headerAddress = XLSX.utils.encode_cell({ r: range.s.r, c: newCol })
      newWorksheet[headerAddress] = {
        t: 's', // string type
        v: MARKUP_LABELS[i]
      }
    }

    // Add markup calculations for each data row
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const costAddress = XLSX.utils.encode_cell({ r: row, c: costColumnIndex })
      const costCell = worksheet[costAddress]

      if (costCell && costCell.v !== undefined && costCell.v !== null && costCell.v !== '') {
        const costValue = typeof costCell.v === 'number' ? costCell.v : parseFloat(costCell.v.toString())

        if (isValidNumber(costValue)) {
          // Add markup values for each percentage
          for (let i = 0; i < MARKUP_PERCENTAGES.length; i++) {
            const markupValue = this.calculateMarkup(costValue, MARKUP_PERCENTAGES[i])
            const newCol = range.e.c + 1 + i
            const markupAddress = XLSX.utils.encode_cell({ r: row, c: newCol })

            if (markupValue !== null) {
              newWorksheet[markupAddress] = {
                t: 'n', // number type
                v: markupValue,
                z: '0.00' // number format with 2 decimal places
              }
            } else {
              newWorksheet[markupAddress] = {
                t: 's',
                v: 'ERROR'
              }
            }
          }
        } else {
          // If cost is not a valid number, add error markers
          for (let i = 0; i < MARKUP_PERCENTAGES.length; i++) {
            const newCol = range.e.c + 1 + i
            const markupAddress = XLSX.utils.encode_cell({ r: row, c: newCol })
            newWorksheet[markupAddress] = {
              t: 's',
              v: 'N/A'
            }
          }
        }
      } else {
        // If no cost cell or empty, add N/A markers
        for (let i = 0; i < MARKUP_PERCENTAGES.length; i++) {
          const newCol = range.e.c + 1 + i
          const markupAddress = XLSX.utils.encode_cell({ r: row, c: newCol })
          newWorksheet[markupAddress] = {
            t: 's',
            v: 'N/A'
          }
        }
      }
    }

    // Update worksheet range
    newWorksheet['!ref'] = XLSX.utils.encode_range(newRange)

    // Preserve column widths and other properties
    if (worksheet['!cols']) {
      newWorksheet['!cols'] = [
        ...worksheet['!cols'],
        ...MARKUP_PERCENTAGES.map(() => ({ wch: 12 })) // Default width for markup columns
      ]
    }

    return newWorksheet
  }

  /**
   * Generate unique sheet name to avoid collisions
   */
  static generateSheetName(baseName: string, existingNames: string[]): string {
    // Clean the base name (remove file extension, sanitize)
    const cleanName = baseName
      .replace(/\.(xlsx|xls)$/i, '')
      .replace(/[\/\\\?\*\[\]]/g, '_') // Replace invalid characters
      .substring(0, 25) // Limit length

    if (!existingNames.includes(cleanName)) {
      return cleanName
    }

    // Handle collisions by appending numbers
    let counter = 2
    let uniqueName = `${cleanName}_${counter}`

    while (existingNames.includes(uniqueName)) {
      counter++
      uniqueName = `${cleanName}_${counter}`
    }

    return uniqueName
  }

  /**
   * Generate master workbook from processed files
   */
  static async generateMasterWorkbook(files: FileObject[]): Promise<XLSX.WorkBook> {
    const masterWorkbook = XLSX.utils.book_new()

    // Set workbook properties
    masterWorkbook.Props = {
      Title: 'Supplier Price List Master',
      Subject: 'Combined supplier price lists with markup calculations',
      Author: 'Supplier Price List Merger',
      CreatedDate: new Date()
    }

    const usedSheetNames: string[] = []
    let validSheetsAdded = 0

    for (const file of files) {
      if (file.status !== 'completed' || !file.workbook) {
        console.warn(`Skipping file ${file.name}: status=${file.status}, hasWorkbook=${!!file.workbook}`)
        continue
      }

      try {
        // Validate workbook structure
        if (!file.workbook.SheetNames || file.workbook.SheetNames.length === 0) {
          console.warn(`No worksheets found in file: ${file.name}`)
          continue
        }

        if (!file.workbook.Sheets) {
          console.warn(`No Sheets object found in file: ${file.name}`)
          continue
        }

        // Get the first worksheet from the source file
        const sourceSheetName = file.workbook.SheetNames[0]
        let sourceWorksheet = file.workbook.Sheets[sourceSheetName]

        // If direct access failed, try alternative approaches
        if (!sourceWorksheet) {
          console.warn(`Direct access to worksheet "${sourceSheetName}" failed for file: ${file.name}`)
          const availableSheets = Object.keys(file.workbook.Sheets)
          console.log('Available sheet keys:', availableSheets)

          // Try case-insensitive match
          const matchingSheet = availableSheets.find(key =>
            key.toLowerCase() === sourceSheetName.toLowerCase()
          )

          if (matchingSheet) {
            sourceWorksheet = file.workbook.Sheets[matchingSheet]
            console.log(`Found worksheet using case-insensitive match: "${matchingSheet}"`)
          } else {
            // Use first available sheet
            const firstAvailableKey = availableSheets[0]
            if (firstAvailableKey) {
              sourceWorksheet = file.workbook.Sheets[firstAvailableKey]
              console.log(`Using first available worksheet: "${firstAvailableKey}"`)
            }
          }
        }

        if (!sourceWorksheet) {
          console.warn(`No accessible worksheet found in file: ${file.name}. Available sheets: ${Object.keys(file.workbook.Sheets).join(', ')}`)
          continue
        }

        // Validate worksheet has content
        if (!sourceWorksheet['!ref']) {
          console.warn(`Worksheet "${sourceSheetName}" in file "${file.name}" is empty`)
          continue
        }

        // Generate unique sheet name for master workbook
        const sheetName = this.generateSheetName(file.name, usedSheetNames)
        usedSheetNames.push(sheetName)

        // Add markup columns if cost column was detected
        let processedWorksheet: XLSX.WorkSheet
        if (file.costColumnIndex !== -1) {
          console.log(`🔢 Adding markup columns for file: ${file.name}, cost column: ${file.costColumnIndex}`)
          try {
            processedWorksheet = this.addMarkupColumns(sourceWorksheet, file.costColumnIndex)
            console.log(`✅ Successfully added markup columns to ${file.name}`)
          } catch (markupError) {
            console.warn(`❌ Failed to add markup columns for ${file.name}:`, markupError)
            // Fall back to copying worksheet as-is
            processedWorksheet = { ...sourceWorksheet }
          }
        } else {
          console.log(`⚠️ No cost column detected for ${file.name}, skipping markup calculations`)
          // Copy worksheet as-is if no cost column detected
          processedWorksheet = { ...sourceWorksheet }
        }

        // Add processed worksheet to master workbook
        XLSX.utils.book_append_sheet(masterWorkbook, processedWorksheet, sheetName)
        validSheetsAdded++
        console.log(`Successfully added worksheet "${sheetName}" from file "${file.name}"`)

      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
        // Continue with other files instead of failing completely
        continue
      }
    }

    // Validate that we have at least one valid worksheet
    if (validSheetsAdded === 0) {
      throw new Error('No valid worksheets to include in master workbook')
    }

    console.log(`Master workbook created with ${validSheetsAdded} worksheets`)
    return masterWorkbook
  }

  /**
   * Generate Excel file buffer from workbook
   */
  static generateExcelBuffer(workbook: XLSX.WorkBook): ArrayBuffer {
    try {
      return XLSX.write(workbook, {
        type: 'array',
        bookType: 'xlsx',
        bookSST: false,
        compression: true
      })
    } catch (error) {
      throw new Error(`Failed to generate Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Create download URL for Excel file
   */
  static createDownloadUrl(buffer: ArrayBuffer): string {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    return URL.createObjectURL(blob)
  }

  /**
   * Generate filename for master workbook
   */
  static generateFileName(): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:\-]/g, '').replace('T', '_')
    return `Supplier_Master_${timestamp}.xlsx`
  }

  /**
   * Download master workbook
   */
  static downloadMasterWorkbook(workbook: XLSX.WorkBook): void {
    try {
      // Generate Excel buffer
      const buffer = this.generateExcelBuffer(workbook)

      // Create download URL
      const url = this.createDownloadUrl(buffer)

      // Generate filename
      const filename = this.generateFileName()

      // Create and trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up URL
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 1000)

    } catch (error) {
      throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Validate workbook before processing
   */
  static validateWorkbook(workbook: XLSX.WorkBook): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!workbook) {
      errors.push('Workbook is null or undefined')
      return { isValid: false, errors }
    }

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      errors.push('Workbook contains no sheets')
      return { isValid: false, errors }
    }

    // Check if at least one sheet has data
    let hasData = false
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName]
      if (sheet && sheet['!ref']) {
        hasData = true
        break
      }
    }

    if (!hasData) {
      errors.push('Workbook contains no data')
      return { isValid: false, errors }
    }

    return { isValid: true, errors: [] }
  }
}