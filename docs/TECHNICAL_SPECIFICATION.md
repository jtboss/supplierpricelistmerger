# Technical Specification: Supplier Price List Merger

## 🔧 Technical Architecture

### **Core Technology Stack**
- **Language**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with Flexbox/Grid
- **File Processing**: SheetJS/XLSX library v0.18.5
- **File Structure**: Single HTML file with embedded CSS/JS
- **Target Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

### **Application Architecture**

```
SupplierPriceListMerger
├── UI Layer (DOM Manipulation)
│   ├── FileUploadHandler
│   ├── ProgressIndicator
│   ├── ErrorDisplay
│   └── PreviewRenderer
├── Business Logic Layer
│   ├── ExcelProcessor
│   ├── MarkupCalculator
│   ├── ColumnDetector
│   └── DataValidator
├── Data Layer
│   ├── FileManager
│   ├── WorksheetBuilder
│   └── ExcelGenerator
└── Utility Layer
    ├── ErrorHandler
    ├── ProgressTracker
    └── MemoryManager
```

## 🗂️ Data Structures

### **File State Management**
```javascript
const appState = {
  uploadedFiles: [],
  processedData: {},
  currentProgress: 0,
  errors: [],
  isProcessing: false,
  masterWorkbook: null
};

const fileObject = {
  id: 'unique-id',
  name: 'supplier1.xlsx',
  size: 1024000,
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  file: File,
  workbook: null,
  costColumnIndex: -1,
  errors: []
};
```

### **Column Detection Configuration**
```javascript
const COST_COLUMN_PATTERNS = [
  /^cost$/i,
  /^price$/i,
  /^cost[\s_]?price$/i,
  /^unit[\s_]?price$/i,
  /^selling[\s_]?price$/i,
  /^wholesale[\s_]?price$/i,
  /^supplier[\s_]?price$/i,
  /^base[\s_]?price$/i
];

const MARKUP_PERCENTAGES = [0.05, 0.10, 0.15, 0.20, 0.30];
const MARKUP_LABELS = ['5% Markup', '10% Markup', '15% Markup', '20% Markup', '30% Markup'];
```

## 🔄 Core Processing Flow

### **1. File Upload & Validation**
```javascript
class FileUploadHandler {
  validateFile(file) {
    // Check file type, size, format
    // Return validation result
  }
  
  async readFile(file) {
    // Use FileReader API
    // Return ArrayBuffer for XLSX processing
  }
}
```

### **2. Excel Processing**
```javascript
class ExcelProcessor {
  async parseWorkbook(arrayBuffer) {
    // Use XLSX.read() to parse
    // Extract worksheet data
    // Return structured data
  }
  
  detectCostColumn(worksheet) {
    // Scan headers for cost price patterns
    // Return column index or -1 if not found
  }
}
```

### **3. Markup Calculations**
```javascript
class MarkupCalculator {
  calculateMarkups(costValue, markupPercentages) {
    // Apply markup formula: cost * (1 + percentage)
    // Handle non-numeric values gracefully
    // Return array of markup values
  }
  
  addMarkupColumns(worksheet, costColumnIndex) {
    // Add 5 new columns with markup calculations
    // Preserve existing data structure
  }
}
```

### **4. Master Workbook Generation**
```javascript
class WorksheetBuilder {
  createMasterWorkbook() {
    // Initialize new XLSX workbook
    // Set up workbook properties
  }
  
  addSupplierWorksheet(workbook, supplierData, sheetName) {
    // Create worksheet from supplier data
    // Add to master workbook
  }
  
  generateDownloadFile(workbook) {
    // Convert to binary
    // Create download blob
    // Trigger download
  }
}
```

## 🎨 UI/UX Implementation

### **CSS Architecture**
```css
/* CSS Custom Properties for theming */
:root {
  --primary-color: #4a90e2;
  --secondary-color: #7b68ee;
  --success-color: #28a745;
  --error-color: #dc3545;
  --warning-color: #ffc107;
  --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Component-based styling */
.upload-zone { /* drag/drop area */ }
.file-list { /* uploaded files display */ }
.progress-bar { /* processing indicator */ }
.preview-table { /* data preview */ }
.error-message { /* error display */ }
```

### **Responsive Design Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Animation & Feedback**
- File drop animations
- Progress bar transitions
- Success/error state indicators
- Loading spinners

## 🚦 Error Handling Strategy

### **Error Categories**
1. **File Validation Errors**
   - Invalid file type
   - File too large
   - Corrupted file

2. **Processing Errors**
   - Unable to parse Excel
   - Missing cost column
   - Invalid data format

3. **System Errors**
   - Memory limitations
   - Browser compatibility
   - Network issues (CDN)

### **Error Recovery Mechanisms**
```javascript
class ErrorHandler {
  handleFileError(file, error) {
    // Log error with context
    // Display user-friendly message
    // Allow retry or skip
  }
  
  handleProcessingError(stage, error) {
    // Identify failure point
    // Attempt graceful recovery
    // Provide actionable feedback
  }
}
```

## 📊 Performance Considerations

### **Memory Management**
- Process files sequentially to manage memory
- Clean up temporary objects after processing
- Monitor memory usage during large file operations

### **Optimization Techniques**
- Lazy loading of file contents
- Progressive rendering of preview data
- Chunked processing for large datasets
- Debounced user interactions

### **File Size Limits**
- Recommended: 10MB per file
- Maximum: 50MB per file
- Total batch: 200MB

## 🔒 Security Considerations

### **Client-Side Security**
- File type validation
- Size limit enforcement
- Content sanitization
- XSS prevention in preview rendering

### **Data Privacy**
- No data transmission to servers
- Local processing only
- Temporary data cleanup
- No persistent storage

## 🧪 Testing Strategy

### **Unit Testing Areas**
- File validation functions
- Markup calculations
- Column detection algorithms
- Error handling scenarios

### **Integration Testing**
- End-to-end file processing workflow
- UI interaction flows
- Cross-browser compatibility
- Performance under load

### **Manual Testing Scenarios**
- Various Excel file formats
- Different column structures
- Large file processing
- Error recovery scenarios
- Mobile responsiveness

## 📈 Performance Metrics

### **Success Criteria**
- **Load Time**: < 3 seconds initial load
- **Processing Speed**: < 5 seconds per 1MB file
- **Memory Usage**: < 100MB for typical workload
- **Error Rate**: < 1% for valid Excel files
- **User Completion**: > 90% task completion rate

### **Monitoring Points**
- File upload success rate
- Processing time per file
- Error frequency by type
- Browser compatibility issues
- User abandonment points

## 🔄 Future Enhancement Roadmap

### **Phase 2 Features**
- Custom markup percentage configuration
- Column mapping interface
- Data validation rules
- Export format options

### **Phase 3 Features**
- Cloud storage integration
- Collaborative sharing
- Advanced data transformation
- API integration capabilities

## 📋 Implementation Checklist

### **Core Functionality**
- [ ] File drag/drop interface
- [ ] Excel file parsing (XLSX library)
- [ ] Cost column detection
- [ ] Markup calculations
- [ ] Master workbook generation
- [ ] File download mechanism

### **User Experience**
- [ ] Progress indicators
- [ ] Error messaging
- [ ] File management
- [ ] Data preview
- [ ] Responsive design
- [ ] Loading animations

### **Quality Assurance**
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Error handling coverage
- [ ] Memory leak prevention
- [ ] Security validation
- [ ] Accessibility compliance 