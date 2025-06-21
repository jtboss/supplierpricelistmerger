import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock XLSX library for testing
vi.mock('xlsx', () => ({
  read: vi.fn(),
  write: vi.fn(),
  utils: {
    json_to_sheet: vi.fn(),
    book_new: vi.fn(),
    book_append_sheet: vi.fn(),
    sheet_to_json: vi.fn(),
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