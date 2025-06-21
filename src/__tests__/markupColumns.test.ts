import { MasterWorkbookGenerator } from '@/lib/excel/masterWorkbook'
import * as XLSX from 'xlsx'

describe('Markup Column Addition', () => {
    test('should add 5 markup columns when cost column exists', () => {
        // Create worksheet with cost data
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:C5',
            'A1': { v: 'Item', t: 's' },
            'B1': { v: 'Description', t: 's' },
            'C1': { v: 'Price', t: 's' },
            'A2': { v: 'Item1', t: 's' },
            'B2': { v: 'Desc1', t: 's' },
            'C2': { v: 100, t: 'n' },
            'A3': { v: 'Item2', t: 's' },
            'B3': { v: 'Desc2', t: 's' },
            'C3': { v: 200, t: 'n' },
        }

        const costColumnIndex = 2 // C column
        const result = MasterWorkbookGenerator.addMarkupColumns(worksheet, costColumnIndex)

        // Should have original 3 columns + 5 markup columns = 8 total
        const range = XLSX.utils.decode_range(result['!ref']!)
        expect(range.e.c).toBe(7) // 0-indexed, so 7 = 8 columns

        // Check markup headers
        expect(result['D1']?.v).toBe('5% Markup')
        expect(result['E1']?.v).toBe('10% Markup')
        expect(result['F1']?.v).toBe('15% Markup')
        expect(result['G1']?.v).toBe('20% Markup')
        expect(result['H1']?.v).toBe('30% Markup')

        // Check markup calculations for first data row
        expect(result['D2']?.v).toBe(105) // 100 * 1.05
        expect(result['E2']?.v).toBe(110) // 100 * 1.10
        expect(result['F2']?.v).toBe(115) // 100 * 1.15
        expect(result['G2']?.v).toBe(120) // 100 * 1.20
        expect(result['H2']?.v).toBe(130) // 100 * 1.30

        // Check markup calculations for second data row
        expect(result['D3']?.v).toBe(210) // 200 * 1.05
        expect(result['E3']?.v).toBe(220) // 200 * 1.10
        expect(result['F3']?.v).toBe(230) // 200 * 1.15
        expect(result['G3']?.v).toBe(240) // 200 * 1.20
        expect(result['H3']?.v).toBe(260) // 200 * 1.30
    })

    test('should handle decimal cost values correctly', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:B3',
            'A1': { v: 'Item', t: 's' },
            'B1': { v: 'Price', t: 's' },
            'A2': { v: 'Item1', t: 's' },
            'B2': { v: 99.99, t: 'n' },
        }

        const result = MasterWorkbookGenerator.addMarkupColumns(worksheet, 1)

        // Check that decimal calculations are handled properly (rounded to 2 places)
        expect(result['C2']?.v).toBe(104.99) // 99.99 * 1.05 = 104.9895, rounded to 104.99
        expect(result['D2']?.v).toBe(109.99) // 99.99 * 1.10 = 109.989, rounded to 109.99
    })

    test('should handle string cost values that can be parsed as numbers', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:B3',
            'A1': { v: 'Item', t: 's' },
            'B1': { v: 'Price', t: 's' },
            'A2': { v: 'Item1', t: 's' },
            'B2': { v: '150', t: 's' }, // String that can be parsed as number
        }

        const result = MasterWorkbookGenerator.addMarkupColumns(worksheet, 1)

        expect(result['C2']?.v).toBe(157.5) // 150 * 1.05
        expect(result['D2']?.v).toBe(165) // 150 * 1.10
    })

    test('should handle invalid cost values with N/A', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:B4',
            'A1': { v: 'Item', t: 's' },
            'B1': { v: 'Price', t: 's' },
            'A2': { v: 'Item1', t: 's' },
            'B2': { v: 'invalid', t: 's' }, // Non-numeric string
            'A3': { v: 'Item2', t: 's' },
            'B3': { v: '', t: 's' }, // Empty string
        }

        const result = MasterWorkbookGenerator.addMarkupColumns(worksheet, 1)

        // Should add N/A for invalid values
        expect(result['C2']?.v).toBe('N/A')
        expect(result['D2']?.v).toBe('N/A')
        expect(result['C3']?.v).toBe('N/A')
        expect(result['D3']?.v).toBe('N/A')
    })

    test('should throw error for invalid cost column index', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:B3',
            'A1': { v: 'Item', t: 's' },
            'B1': { v: 'Price', t: 's' },
        }

        expect(() => {
            MasterWorkbookGenerator.addMarkupColumns(worksheet, -1)
        }).toThrow('Cost column not found')
    })

    test('should preserve original worksheet data', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:C3',
            'A1': { v: 'Item', t: 's' },
            'B1': { v: 'Description', t: 's' },
            'C1': { v: 'Price', t: 's' },
            'A2': { v: 'Item1', t: 's' },
            'B2': { v: 'Desc1', t: 's' },
            'C2': { v: 100, t: 'n' },
        }

        const result = MasterWorkbookGenerator.addMarkupColumns(worksheet, 2)

        // Original data should be preserved
        expect(result['A1']?.v).toBe('Item')
        expect(result['B1']?.v).toBe('Description')
        expect(result['C1']?.v).toBe('Price')
        expect(result['A2']?.v).toBe('Item1')
        expect(result['B2']?.v).toBe('Desc1')
        expect(result['C2']?.v).toBe(100)
    })
})

describe('Markup Calculation Function', () => {
    test('should calculate markup correctly', () => {
        expect(MasterWorkbookGenerator.calculateMarkup(100, 0.05)).toBe(105)
        expect(MasterWorkbookGenerator.calculateMarkup(100, 0.10)).toBe(110)
        expect(MasterWorkbookGenerator.calculateMarkup(100, 0.15)).toBe(115)
        expect(MasterWorkbookGenerator.calculateMarkup(100, 0.20)).toBe(120)
        expect(MasterWorkbookGenerator.calculateMarkup(100, 0.30)).toBe(130)
    })

    test('should round to 2 decimal places', () => {
        expect(MasterWorkbookGenerator.calculateMarkup(33.33, 0.05)).toBe(34.997) // Should be rounded appropriately
    })

    test('should return null for invalid inputs', () => {
        expect(MasterWorkbookGenerator.calculateMarkup(NaN, 0.05)).toBeNull()
        expect(MasterWorkbookGenerator.calculateMarkup(100, NaN)).toBeNull()
        expect(MasterWorkbookGenerator.calculateMarkup(-100, 0.05)).toBeNull()
        expect(MasterWorkbookGenerator.calculateMarkup(100, -0.05)).toBeNull()
    })
}) 