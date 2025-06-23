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

    test('should detect COST column', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:C5',
            'A1': { v: 'Item', t: 's' },
            'B1': { v: 'Description', t: 's' },
            'C1': { v: 'COST', t: 's' },
        }

        const costColumnIndex = ExcelProcessor.detectCostColumn(worksheet)
        expect(costColumnIndex).toBe(2) // C column = index 2
    })

    test('should return -1 when no cost column found', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:D5',
            'A1': { v: 'Item', t: 's' },
            'B1': { v: 'Description', t: 's' },
            'C1': { v: 'Quantity', t: 's' },
            'D1': { v: 'Category', t: 's' },
        }

        const costColumnIndex = ExcelProcessor.detectCostColumn(worksheet)
        expect(costColumnIndex).toBe(-1)
    })

    test('should handle case-insensitive detection', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:C5',
            'A1': { v: 'item', t: 's' },
            'B1': { v: 'desc', t: 's' },
            'C1': { v: 'price', t: 's' }, // lowercase
        }

        const costColumnIndex = ExcelProcessor.detectCostColumn(worksheet)
        expect(costColumnIndex).toBe(2) // C column = index 2
    })

    test('should prefer exact matches over partial matches', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:D5',
            'A1': { v: 'Item', t: 's' },
            'B1': { v: 'Base Price Info', t: 's' }, // contains "price" but not exact
            'C1': { v: 'PRICE', t: 's' }, // exact match
            'D1': { v: 'Description', t: 's' },
        }

        const costColumnIndex = ExcelProcessor.detectCostColumn(worksheet)
        expect(costColumnIndex).toBe(2) // C column = index 2 (exact match)
    })
}) 