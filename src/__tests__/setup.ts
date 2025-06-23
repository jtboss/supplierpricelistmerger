import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock XLSX library for testing
vi.mock('xlsx', () => ({
  read: vi.fn(),
  write: vi.fn().mockReturnValue(new ArrayBuffer(8)),
  utils: {
    json_to_sheet: vi.fn(),
    book_new: vi.fn(() => ({ SheetNames: [], Sheets: {} })),
    book_append_sheet: vi.fn(),
    sheet_to_json: vi.fn(),
    aoa_to_sheet: vi.fn((data) => {
      // Create a mock worksheet with proper structure
      const worksheet: any = { '!ref': 'A1:Z100' }

      // Add cells based on data
      data.forEach((row: any[], rowIndex: number) => {
        row.forEach((cell: any, colIndex: number) => {
          const cellAddress = String.fromCharCode(65 + colIndex) + (rowIndex + 1)
          worksheet[cellAddress] = {
            v: cell,
            t: typeof cell === 'number' ? 'n' : 's'
          }
        })
      })

      return worksheet
    }),
    decode_range: vi.fn((ref: string) => {
      // Parse basic cell ranges like "A1:C5"
      const [start, end] = ref.split(':')
      const startCol = start.charCodeAt(0) - 65 // A=0, B=1, etc
      const startRow = parseInt(start.slice(1)) - 1 // 1-based to 0-based
      const endCol = end.charCodeAt(0) - 65
      const endRow = parseInt(end.slice(1)) - 1

      return {
        s: { r: startRow, c: startCol },
        e: { r: endRow, c: endCol }
      }
    }),
    encode_range: vi.fn((range: any) => {
      const startCol = String.fromCharCode(65 + range.s.c)
      const startRow = range.s.r + 1
      const endCol = String.fromCharCode(65 + range.e.c)
      const endRow = range.e.r + 1
      return `${startCol}${startRow}:${endCol}${endRow}`
    }),
    encode_cell: vi.fn((cell: any) => {
      const col = String.fromCharCode(65 + cell.c)
      const row = cell.r + 1
      return `${col}${row}`
    }),
  },
}))

// Mock FileReader for testing file operations
const MockFileReader = vi.fn(() => ({
  readAsArrayBuffer: vi.fn(),
  readAsText: vi.fn(),
  result: null,
  onload: null,
  onerror: null,
  EMPTY: 0,
  LOADING: 1,
  DONE: 2,
}))

Object.defineProperty(globalThis, 'FileReader', {
  value: MockFileReader,
  writable: true,
}) 