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
    aoa_to_sheet: vi.fn((data: unknown[][]) => {
      // Create a mock worksheet with proper structure
      const worksheet: Record<string, unknown> = { '!ref': 'A1:Z100' }

      // Add cells based on data
      data.forEach((row: unknown[], rowIndex: number) => {
        row.forEach((cell: unknown, colIndex: number) => {
          const cellAddress = String.fromCharCode(65 + colIndex) + (rowIndex + 1)
          worksheet[cellAddress] = {
            v: cell,
            t: typeof cell === 'number' ? 'n' : 's'
          }
        })
      })

      return worksheet
    }),
    encode_cell: vi.fn((cellRef: { r: number; c: number }) => {
      return String.fromCharCode(65 + cellRef.c) + (cellRef.r + 1)
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    decode_range: vi.fn((_ref: string) => {
      // Simple mock for A1:Z100 range
      return {
        s: { r: 0, c: 0 }, // start
        e: { r: 99, c: 25 } // end
      }
    }),
    encode_range: vi.fn((range: { s: { r: number; c: number }, e: { r: number; c: number } }) => {
      const startCell = String.fromCharCode(65 + range.s.c) + (range.s.r + 1)
      const endCell = String.fromCharCode(65 + range.e.c) + (range.e.r + 1)
      return `${startCell}:${endCell}`
    }),
    writeFile: vi.fn()
  }
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