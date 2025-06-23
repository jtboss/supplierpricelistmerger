/**
 * Integration tests for end-to-end markup processing
 * These tests verify the complete flow from file processing to markup column addition
 */

import { MasterWorkbookGenerator } from '@/lib/excel/masterWorkbook'
import { ExcelProcessor } from '@/lib/excel/processor'
import { FileObject } from '@/types'
import * as XLSX from 'xlsx'

describe('End-to-End Markup Processing', () => {
    // Helper function to create a mock Excel file buffer
    function createMockExcelBuffer(): ArrayBuffer {
        // Create a simple workbook with cost data
        const workbook = XLSX.utils.book_new()

        const worksheetData = [
            ['Item Code', 'Description', 'Unit Price', 'Category'],
            ['ITM001', 'Widget A', 25.50, 'Electronics'],
            ['ITM002', 'Widget B', 45.00, 'Electronics'],
            ['ITM003', 'Widget C', 12.75, 'Hardware'],
        ]

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

        return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
    }

    test('should process file and add markup columns to master workbook', async () => {
        // Create mock file with proper Excel data
        const excelBuffer = createMockExcelBuffer()
        const mockFile = new File([excelBuffer], 'test-products.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        // Create FileObject as it would be created in the real app
        const fileObject: FileObject = {
            id: 'test-1',
            name: 'test-products.xlsx',
            size: mockFile.size,
            type: mockFile.type,
            file: mockFile,
            costColumnIndex: -1, // Will be set during processing
            errors: [],
            status: 'pending'
        }

        // Step 1: Process the file (this should detect cost column)
        const processResult = await ExcelProcessor.processFile(mockFile)

        // Verify cost column was detected
        expect(processResult.analysis.costColumnIndex).not.toBe(-1)
        expect(processResult.analysis.costColumnIndex).toBe(2) // "Unit Price" should be column C (index 2)

        // Update file object with processing results
        const processedFileObject: FileObject = {
            ...fileObject,
            workbook: processResult.workbook,
            costColumnIndex: processResult.analysis.costColumnIndex,
            status: 'completed'
        }

        // Step 2: Generate master workbook (this should add markup columns)
        const masterWorkbook = await MasterWorkbookGenerator.generateMasterWorkbook([processedFileObject])

        // Verify master workbook was created
        expect(masterWorkbook).toBeDefined()
        expect(masterWorkbook.SheetNames.length).toBe(1)

        // Get the processed worksheet from master workbook
        const sheetName = masterWorkbook.SheetNames[0]
        const processedWorksheet = masterWorkbook.Sheets[sheetName]

        // Verify worksheet exists and has expected range
        expect(processedWorksheet).toBeDefined()
        expect(processedWorksheet['!ref']).toBeDefined()

        const range = XLSX.utils.decode_range(processedWorksheet['!ref']!)

        // Should have original 4 columns (Item Code, Description, Unit Price, Category) 
        // + 5 markup columns = 9 total columns
        expect(range.e.c).toBe(8) // 0-indexed, so 8 = 9 columns

        // Verify markup column headers are present
        expect(processedWorksheet['E1']?.v).toBe('5% Markup')   // Column E
        expect(processedWorksheet['F1']?.v).toBe('10% Markup')  // Column F
        expect(processedWorksheet['G1']?.v).toBe('15% Markup')  // Column G
        expect(processedWorksheet['H1']?.v).toBe('20% Markup')  // Column H
        expect(processedWorksheet['I1']?.v).toBe('30% Markup')  // Column I

        // Verify markup calculations for first data row (ITM001, price: 25.50)
        expect(processedWorksheet['E2']?.v).toBe(26.78)  // 25.50 * 1.05 = 26.775, rounded to 26.78
        expect(processedWorksheet['F2']?.v).toBe(28.05)  // 25.50 * 1.10 = 28.05
        expect(processedWorksheet['G2']?.v).toBe(29.33)  // 25.50 * 1.15 = 29.325, rounded to 29.33
        expect(processedWorksheet['H2']?.v).toBe(30.6)   // 25.50 * 1.20 = 30.6
        expect(processedWorksheet['I2']?.v).toBe(33.15)  // 25.50 * 1.30 = 33.15

        // Verify markup calculations for second data row (ITM002, price: 45.00)
        expect(processedWorksheet['E3']?.v).toBe(47.25)  // 45.00 * 1.05 = 47.25
        expect(processedWorksheet['F3']?.v).toBe(49.5)   // 45.00 * 1.10 = 49.5
        expect(processedWorksheet['G3']?.v).toBe(51.75)  // 45.00 * 1.15 = 51.75
        expect(processedWorksheet['H3']?.v).toBe(54.0)   // 45.00 * 1.20 = 54.0
        expect(processedWorksheet['I3']?.v).toBe(58.5)   // 45.00 * 1.30 = 58.5

        // Verify original data is preserved
        expect(processedWorksheet['A2']?.v).toBe('ITM001')
        expect(processedWorksheet['B2']?.v).toBe('Widget A')
        expect(processedWorksheet['C2']?.v).toBe(25.50)
        expect(processedWorksheet['D2']?.v).toBe('Electronics')
    })

    test('should handle files without cost columns gracefully', async () => {
        // Create workbook without any cost column
        const workbook = XLSX.utils.book_new()
        const worksheetData = [
            ['Item Code', 'Description', 'Category', 'Supplier'],
            ['ITM001', 'Widget A', 'Electronics', 'Supplier A'],
            ['ITM002', 'Widget B', 'Electronics', 'Supplier B'],
        ]
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

        const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
        const mockFile = new File([excelBuffer], 'no-cost-column.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        // Process the file
        const processResult = await ExcelProcessor.processFile(mockFile)

        // Verify no cost column was detected
        expect(processResult.analysis.costColumnIndex).toBe(-1)

        const fileObject: FileObject = {
            id: 'test-2',
            name: 'no-cost-column.xlsx',
            size: mockFile.size,
            type: mockFile.type,
            file: mockFile,
            workbook: processResult.workbook,
            costColumnIndex: processResult.analysis.costColumnIndex,
            errors: [],
            status: 'completed'
        }

        // Generate master workbook
        const masterWorkbook = await MasterWorkbookGenerator.generateMasterWorkbook([fileObject])

        // Verify worksheet was included but without markup columns
        expect(masterWorkbook.SheetNames.length).toBe(1)
        const processedWorksheet = masterWorkbook.Sheets[masterWorkbook.SheetNames[0]]
        const range = XLSX.utils.decode_range(processedWorksheet['!ref']!)

        // Should have only original 4 columns (no markup columns added)
        expect(range.e.c).toBe(3) // 0-indexed, so 3 = 4 columns

        // Verify original data is preserved
        expect(processedWorksheet['A1']?.v).toBe('Item Code')
        expect(processedWorksheet['D1']?.v).toBe('Supplier')
        expect(processedWorksheet['A2']?.v).toBe('ITM001')
    })

    test('should handle multiple files with different cost column positions', async () => {
        // Create first file with cost in column B
        const workbook1 = XLSX.utils.book_new()
        const worksheetData1 = [
            ['Code', 'Price', 'Description'],
            ['A001', 100.00, 'Product A'],
            ['A002', 150.00, 'Product B'],
        ]
        const worksheet1 = XLSX.utils.aoa_to_sheet(worksheetData1)
        XLSX.utils.book_append_sheet(workbook1, worksheet1, 'Sheet1')

        // Create second file with cost in column C
        const workbook2 = XLSX.utils.book_new()
        const worksheetData2 = [
            ['Item', 'Description', 'Unit Price'],
            ['B001', 'Product C', 75.50],
            ['B002', 'Product D', 90.25],
        ]
        const worksheet2 = XLSX.utils.aoa_to_sheet(worksheetData2)
        XLSX.utils.book_append_sheet(workbook2, worksheet2, 'Sheet1')

        // Convert to files
        const buffer1 = XLSX.write(workbook1, { type: 'array', bookType: 'xlsx' })
        const buffer2 = XLSX.write(workbook2, { type: 'array', bookType: 'xlsx' })

        const file1 = new File([buffer1], 'file1.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const file2 = new File([buffer2], 'file2.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        // Process both files
        const result1 = await ExcelProcessor.processFile(file1)
        const result2 = await ExcelProcessor.processFile(file2)

        // Verify different cost column positions
        expect(result1.analysis.costColumnIndex).toBe(1) // "Price" in column B
        expect(result2.analysis.costColumnIndex).toBe(2) // "Unit Price" in column C

        const fileObjects: FileObject[] = [
            {
                id: 'test-3',
                name: 'file1.xlsx',
                size: file1.size,
                type: file1.type,
                file: file1,
                workbook: result1.workbook,
                costColumnIndex: result1.analysis.costColumnIndex,
                errors: [],
                status: 'completed'
            },
            {
                id: 'test-4',
                name: 'file2.xlsx',
                size: file2.size,
                type: file2.type,
                file: file2,
                workbook: result2.workbook,
                costColumnIndex: result2.analysis.costColumnIndex,
                errors: [],
                status: 'completed'
            }
        ]

        // Generate master workbook
        const masterWorkbook = await MasterWorkbookGenerator.generateMasterWorkbook(fileObjects)

        // Should have 2 worksheets
        expect(masterWorkbook.SheetNames.length).toBe(2)

        // Check first worksheet (cost in column B, markup should start at column D)
        const sheet1 = masterWorkbook.Sheets[masterWorkbook.SheetNames[0]]
        expect(sheet1['D1']?.v).toBe('5% Markup') // Markup headers start after original columns
        expect(sheet1['D2']?.v).toBe(105) // 100.00 * 1.05

        // Check second worksheet (cost in column C, markup should start at column D)
        const sheet2 = masterWorkbook.Sheets[masterWorkbook.SheetNames[1]]
        expect(sheet2['D1']?.v).toBe('5% Markup') // Markup headers start after original columns
        expect(sheet2['D2']?.v).toBe(79.28) // 75.50 * 1.05 = 79.275, rounded to 79.28
    })
}) 