# Coding Standards: Supplier Price List Merger

## 📝 JavaScript Coding Standards

### **ES6+ Features Usage**
```javascript
// ✅ Use const/let instead of var
const MARKUP_PERCENTAGES = [0.05, 0.10, 0.15, 0.20, 0.30];
let currentFileIndex = 0;

// ✅ Use arrow functions for callbacks
files.forEach(file => processFile(file));

// ✅ Use async/await instead of callbacks
async function processFile(file) {
  try {
    const data = await readFileAsArrayBuffer(file);
    return parseExcelData(data);
  } catch (error) {
    handleError(error);
  }
}

// ✅ Use template literals for string formatting
const message = `Processing file ${fileName} (${fileSize} bytes)`;

// ✅ Use destructuring for object/array operations
const { name, size, type } = file;
const [firstSheet, ...otherSheets] = workbook.SheetNames;
```

### **Class Structure & Organization**
```javascript
// ✅ Use class syntax for logical grouping
class ExcelProcessor {
  constructor(options = {}) {
    this.options = { ...this.defaultOptions, ...options };
    this.cache = new Map();
  }

  // ✅ Public methods first
  async processFile(file) {
    this._validateFile(file);
    return this._parseWorkbook(file);
  }

  // ✅ Private methods with underscore prefix
  _validateFile(file) {
    if (!this._isValidExcelFile(file)) {
      throw new Error(`Invalid file type: ${file.type}`);
    }
  }

  _isValidExcelFile(file) {
    return VALID_EXCEL_TYPES.includes(file.type);
  }

  // ✅ Static methods for utilities
  static generateUniqueId() {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### **Error Handling Patterns**
```javascript
// ✅ Custom error classes for specific scenarios
class FileValidationError extends Error {
  constructor(file, reason) {
    super(`File validation failed: ${reason}`);
    this.name = 'FileValidationError';
    this.file = file;
    this.reason = reason;
  }
}

class ProcessingError extends Error {
  constructor(stage, originalError) {
    super(`Processing failed at stage: ${stage}`);
    this.name = 'ProcessingError';
    this.stage = stage;
    this.originalError = originalError;
  }
}

// ✅ Consistent error handling wrapper
function withErrorHandling(asyncFn) {
  return async function(...args) {
    try {
      return await asyncFn.apply(this, args);
    } catch (error) {
      logger.error('Operation failed:', error);
      throw error;
    }
  };
}
```

### **Function Design Principles**
```javascript
// ✅ Single responsibility functions
function calculateMarkup(cost, percentage) {
  if (!isValidNumber(cost) || !isValidNumber(percentage)) {
    return null;
  }
  return cost * (1 + percentage);
}

// ✅ Pure functions when possible
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// ✅ Clear parameter validation
function addMarkupColumns(worksheet, costColumnIndex, markupPercentages) {
  if (!worksheet) throw new Error('Worksheet is required');
  if (costColumnIndex < 0) throw new Error('Valid cost column index required');
  if (!Array.isArray(markupPercentages)) throw new Error('Markup percentages must be an array');
  
  // Implementation...
}
```

### **Constants & Configuration**
```javascript
// ✅ Use UPPER_SNAKE_CASE for constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const VALID_EXCEL_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
];

const DEFAULT_MARKUP_CONFIG = {
  percentages: [0.05, 0.10, 0.15, 0.20, 0.30],
  labels: ['5% Markup', '10% Markup', '15% Markup', '20% Markup', '30% Markup'],
  precision: 2
};

// ✅ Group related constants in objects
const UI_STATES = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  ERROR: 'error'
};
```

## 🎨 CSS Coding Standards

### **CSS Architecture**
```css
/* ✅ Use CSS custom properties for theming */
:root {
  --color-primary: #4a90e2;
  --color-secondary: #7b68ee;
  --color-success: #28a745;
  --color-error: #dc3545;
  --color-warning: #ffc107;
  
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  --border-radius: 8px;
  --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
}

/* ✅ Use BEM naming convention */
.upload-zone {
  /* Block */
}

.upload-zone__content {
  /* Element */
}

.upload-zone--active {
  /* Modifier */
}

.upload-zone__content--highlighted {
  /* Element with modifier */
}
```

### **Component-Based Styling**
```css
/* ✅ Component structure */
.file-upload {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border: 2px dashed var(--color-primary);
  border-radius: var(--border-radius);
  transition: var(--transition-normal);
}

.file-upload:hover {
  border-color: var(--color-secondary);
  background-color: rgba(74, 144, 226, 0.05);
}

.file-upload--dragover {
  border-color: var(--color-success);
  background-color: rgba(40, 167, 69, 0.1);
}

/* ✅ Responsive design patterns */
.file-list {
  display: grid;
  gap: var(--spacing-sm);
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

@media (max-width: 768px) {
  .file-list {
    grid-template-columns: 1fr;
  }
}
```

### **Utility Classes**
```css
/* ✅ Spacing utilities */
.u-margin-bottom-sm { margin-bottom: var(--spacing-sm); }
.u-margin-bottom-md { margin-bottom: var(--spacing-md); }
.u-margin-bottom-lg { margin-bottom: var(--spacing-lg); }

/* ✅ Display utilities */
.u-hidden { display: none; }
.u-visible { display: block; }
.u-flex { display: flex; }
.u-flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ✅ State utilities */
.u-loading {
  pointer-events: none;
  opacity: 0.6;
}

.u-error {
  color: var(--color-error);
  border-color: var(--color-error);
}
```

## 🗂️ File Organization & Structure

### **Code Organization Within Single HTML File**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta tags and title -->
  
  <!-- ✅ Embedded CSS in logical sections -->
  <style>
    /* 1. CSS Reset & Base Styles */
    /* 2. CSS Custom Properties */
    /* 3. Layout Components */
    /* 4. UI Components */
    /* 5. Utility Classes */
    /* 6. Responsive Styles */
    /* 7. Animation & Transitions */
  </style>
</head>
<body>
  <!-- ✅ Semantic HTML structure -->
  
  <!-- ✅ External library (XLSX) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
  
  <!-- ✅ Application JavaScript in logical sections -->
  <script>
    // 1. Constants & Configuration
    // 2. Utility Functions
    // 3. Core Classes
    // 4. Event Handlers
    // 5. Application Initialization
  </script>
</body>
</html>
```

### **JavaScript Module Pattern**
```javascript
// ✅ Use IIFE to avoid global pollution
(function() {
  'use strict';
  
  // ✅ Application namespace
  const SupplierMerger = {
    // Configuration
    config: {
      maxFileSize: MAX_FILE_SIZE,
      markupPercentages: DEFAULT_MARKUP_CONFIG.percentages
    },
    
    // Core modules
    fileHandler: new FileUploadHandler(),
    excelProcessor: new ExcelProcessor(),
    markupCalculator: new MarkupCalculator(),
    uiManager: new UIManager(),
    
    // Main application logic
    init() {
      this.setupEventListeners();
      this.initializeUI();
    },
    
    async processFiles() {
      // Main processing logic
    }
  };
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    SupplierMerger.init();
  });
})();
```

## 📋 Documentation Standards

### **JSDoc Comments**
```javascript
/**
 * Calculates markup prices for a given cost and percentages
 * @param {number} cost - The base cost price
 * @param {number[]} percentages - Array of markup percentages (e.g., [0.05, 0.10])
 * @returns {number[]} Array of markup prices
 * @throws {Error} When cost is not a valid number
 * @example
 * const markups = calculateMarkups(100, [0.05, 0.10]);
 * // Returns [105, 110]
 */
function calculateMarkups(cost, percentages) {
  if (!isValidNumber(cost)) {
    throw new Error('Cost must be a valid number');
  }
  
  return percentages.map(percentage => cost * (1 + percentage));
}
```

### **Inline Comments**
```javascript
// Process files sequentially to manage memory usage
for (let i = 0; i < files.length; i++) {
  const file = files[i];
  
  // Update progress before processing each file
  updateProgress(i, files.length);
  
  try {
    // Parse Excel workbook from file buffer
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Find the first worksheet (most suppliers use single sheet)
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Detect cost column automatically
    const costColumnIndex = detectCostColumn(worksheet);
    
    if (costColumnIndex === -1) {
      // Skip file if no cost column found, but log warning
      console.warn(`No cost column found in ${file.name}`);
      continue;
    }
    
    // Add markup calculations to the worksheet
    addMarkupColumns(worksheet, costColumnIndex);
    
  } catch (error) {
    // Handle individual file errors gracefully
    handleFileError(file, error);
  }
}
```

## 🔍 Code Quality Standards

### **Validation & Type Checking**
```javascript
// ✅ Input validation functions
function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

function isValidFile(file) {
  return file instanceof File && 
         VALID_EXCEL_TYPES.includes(file.type) && 
         file.size <= MAX_FILE_SIZE;
}

// ✅ Type checking utilities
function ensureArray(value) {
  return Array.isArray(value) ? value : [value];
}

function ensureString(value) {
  return typeof value === 'string' ? value : String(value);
}
```

### **Performance Best Practices**
```javascript
// ✅ Debounce expensive operations
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ✅ Memory cleanup
function cleanupResources() {
  // Clear file references
  appState.uploadedFiles.forEach(fileObj => {
    if (fileObj.workbook) {
      fileObj.workbook = null;
    }
  });
  
  // Clear cached data
  if (appState.masterWorkbook) {
    appState.masterWorkbook = null;
  }
  
  // Force garbage collection hint
  if (window.gc) {
    window.gc();
  }
}
```

## ✅ Code Review Checklist

### **Functionality**
- [ ] All functions have single responsibility
- [ ] Error handling is comprehensive
- [ ] Edge cases are handled
- [ ] Memory management is considered
- [ ] Performance implications are minimal

### **Code Quality**
- [ ] No global variables pollution
- [ ] Consistent naming conventions
- [ ] Proper documentation
- [ ] Clean, readable code structure
- [ ] No code duplication

### **Standards Compliance**
- [ ] Follows ES6+ best practices
- [ ] CSS follows BEM methodology
- [ ] HTML is semantic and accessible
- [ ] Cross-browser compatibility considered
- [ ] Mobile responsiveness implemented

### **Security & Performance**
- [ ] Input validation implemented
- [ ] XSS prevention measures
- [ ] No memory leaks
- [ ] Efficient DOM manipulation
- [ ] Proper resource cleanup 