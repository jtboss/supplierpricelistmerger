import { ExcelProcessor } from '@/lib/excel/processor'
import * as XLSX from 'xlsx'

describe('Cost Column Detection', () => {
    test('should detect UNIT PRICE column', () => {
        // Create mock worksheet with UNIT PRICE header
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:F10',
            'A1': { v: 'STYLE NAME', t: 's' },
            'B1': { v: 'CODE', t: 's' },
            'C1': { v: 'COLOUR', t: 's' },
            'D1': { v: 'SIZE', t: 's' },
            'E1': { v: 'AVAILABILITY', t: 's' },
            'F1': { v: 'UNIT PRICE', t: 's' },
        }

        const costColumnIndex = ExcelProcessor.detectCostColumn(worksheet)
        expect(costColumnIndex).toBe(5) // F column = index 5
    })

    test('should detect PRICE column', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:E10',
            'A1': { v: 'CODE', t: 's' },
            'B1': { v: 'DESCRIPTION', t: 's' },
            'C1': { v: 'QTY', t: 's' },
            'D1': { v: 'UNIT', t: 's' },
            'E1': { v: 'PRICE', t: 's' },
        }

        const costColumnIndex = ExcelProcessor.detectCostColumn(worksheet)
        expect(costColumnIndex).toBe(4) // E column = index 4
    })

    test('should detect cost column', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:C10',
            'A1': { v: 'ITEM', t: 's' },
            'B1': { v: 'DESCRIPTION', t: 's' },
            'C1': { v: 'cost', t: 's' },
        }

        const costColumnIndex = ExcelProcessor.detectCostColumn(worksheet)
        expect(costColumnIndex).toBe(2) // C column = index 2
    })

    test('should return -1 when no cost column found', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:C10',
            'A1': { v: 'ITEM', t: 's' },
            'B1': { v: 'DESCRIPTION', t: 's' },
            'C1': { v: 'QUANTITY', t: 's' },
        }

        const costColumnIndex = ExcelProcessor.detectCostColumn(worksheet)
        expect(costColumnIndex).toBe(-1)
    })

    test('should handle case insensitive matching', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:B10',
            'A1': { v: 'ITEM', t: 's' },
            'B1': { v: 'Price', t: 's' }, // Mixed case
        }

        const costColumnIndex = ExcelProcessor.detectCostColumn(worksheet)
        expect(costColumnIndex).toBe(1) // B column = index 1
    })

    test('should detect cost price with highest confidence', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:D10',
            'A1': { v: 'ITEM', t: 's' },
            'B1': { v: 'SELLING PRICE', t: 's' },
            'C1': { v: 'COST PRICE', t: 's' }, // Should have higher confidence
            'D1': { v: 'RETAIL PRICE', t: 's' },
        }

        const costColumnIndex = ExcelProcessor.detectCostColumn(worksheet)
        expect(costColumnIndex).toBe(2) // C column = index 2 (COST PRICE)
    })
}) 