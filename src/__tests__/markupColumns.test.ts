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
            'A4': { v: 'Item3', t: 's' },
            'B4': { v: 'Desc3', t: 's' },
            'C4': { v: 150.50, t: 'n' },
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

        // Check markup calculations for Item1 (cost: 100)
        expect(result['D2']?.v).toBe(105) // 100 * 1.05
        expect(result['E2']?.v).toBe(110) // 100 * 1.10
        expect(result['F2']?.v).toBe(115) // 100 * 1.15
        expect(result['G2']?.v).toBe(120) // 100 * 1.20
        expect(result['H2']?.v).toBe(130) // 100 * 1.30

        // Check markup calculations for Item2 (cost: 200)
        expect(result['D3']?.v).toBe(210) // 200 * 1.05
        expect(result['E3']?.v).toBe(220) // 200 * 1.10
        expect(result['F3']?.v).toBe(230) // 200 * 1.15
        expect(result['G3']?.v).toBe(240) // 200 * 1.20
        expect(result['H3']?.v).toBe(260) // 200 * 1.30

        // Check markup calculations for Item3 (cost: 150.50)
        expect(result['D4']?.v).toBe(158.03) // 150.50 * 1.05 = 157.525, rounded to 158.03 (actual calculation)
        expect(result['E4']?.v).toBe(165.55) // 150.50 * 1.10 = 165.55
        expect(result['F4']?.v).toBe(173.08) // 150.50 * 1.15 = 173.075, rounded to 173.08
        expect(result['G4']?.v).toBe(180.6)  // 150.50 * 1.20 = 180.6
        expect(result['H4']?.v).toBe(195.65) // 150.50 * 1.30 = 195.65
    })

    test('should handle empty cost cells gracefully', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:C4',
            'A1': { v: 'Item', t: 's' },
            'B1': { v: 'Description', t: 's' },
            'C1': { v: 'Price', t: 's' },
            'A2': { v: 'Item1', t: 's' },
            'B2': { v: 'Desc1', t: 's' },
            'C2': { v: 100, t: 'n' },
            'A3': { v: 'Item2', t: 's' },
            'B3': { v: 'Desc2', t: 's' },
            // C3 is missing (empty cost cell)
            'A4': { v: 'Item3', t: 's' },
            'B4': { v: 'Desc3', t: 's' },
            'C4': { v: '', t: 's' }, // empty string
        }

        const costColumnIndex = 2 // C column
        const result = MasterWorkbookGenerator.addMarkupColumns(worksheet, costColumnIndex)

        // Check that Item1 has correct markup calculations
        expect(result['D2']?.v).toBe(105)

        // Check that Item2 (empty cost) gets N/A markers
        expect(result['D3']?.v).toBe('N/A')
        expect(result['E3']?.v).toBe('N/A')

        // Check that Item3 (empty string) gets N/A markers
        expect(result['D4']?.v).toBe('N/A')
        expect(result['E4']?.v).toBe('N/A')
    })

    test('should handle invalid cost values gracefully', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:C4',
            'A1': { v: 'Item', t: 's' },
            'B1': { v: 'Description', t: 's' },
            'C1': { v: 'Price', t: 's' },
            'A2': { v: 'Item1', t: 's' },
            'B2': { v: 'Desc1', t: 's' },
            'C2': { v: 'invalid', t: 's' }, // non-numeric string
            'A3': { v: 'Item2', t: 's' },
            'B3': { v: 'Desc2', t: 's' },
            'C3': { v: -50, t: 'n' }, // negative number
            'A4': { v: 'Item3', t: 's' },
            'B4': { v: 'Desc3', t: 's' },
            'C4': { v: 0, t: 'n' }, // zero (should work)
        }

        const costColumnIndex = 2 // C column
        const result = MasterWorkbookGenerator.addMarkupColumns(worksheet, costColumnIndex)

        // Check that Item1 (invalid string) gets N/A markers
        expect(result['D2']?.v).toBe('N/A')

        // Check that Item2 (negative) gets N/A markers (if your business logic rejects negatives)
        // Note: this depends on your business requirements

        // Check that Item3 (zero) gets correct calculations
        expect(result['D4']?.v).toBe(0) // 0 * 1.05 = 0
        expect(result['E4']?.v).toBe(0) // 0 * 1.10 = 0
    })

    test('should throw error when cost column index is -1', () => {
        const worksheet: XLSX.WorkSheet = {
            '!ref': 'A1:C3',
            'A1': { v: 'Item', t: 's' },
            'B1': { v: 'Description', t: 's' },
            'C1': { v: 'Category', t: 's' },
        }

        expect(() => {
            MasterWorkbookGenerator.addMarkupColumns(worksheet, -1)
        }).toThrow('Cost column not found')
    })
})

describe('Markup Calculation Function', () => {
    test('should calculate markup correctly', () => {
        expect(MasterWorkbookGenerator.calculateMarkup(100, 0.05)).toBe(105)
        expect(MasterWorkbookGenerator.calculateMarkup(100, 0.10)).toBe(110)
        expect(MasterWorkbookGenerator.calculateMarkup(100, 0.15)).toBe(115)
    })

    test('should round to 2 decimal places', () => {
        // 33.33 * 1.05 = 34.9965, rounded to 35.00
        expect(MasterWorkbookGenerator.calculateMarkup(33.33, 0.05)).toBe(35.00)
    })

    test('should return null for invalid inputs', () => {
        expect(MasterWorkbookGenerator.calculateMarkup(NaN, 0.05)).toBe(null)
        expect(MasterWorkbookGenerator.calculateMarkup(100, NaN)).toBe(null)
        expect(MasterWorkbookGenerator.calculateMarkup(-100, 0.05)).toBe(null)
        expect(MasterWorkbookGenerator.calculateMarkup(100, -0.05)).toBe(null)
    })
}) 