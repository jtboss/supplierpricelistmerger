# Testing Strategy: Supplier Price List Merger

## 🧪 Testing Philosophy

### **Testing Pyramid**
```
                    E2E Tests
                  (Full Workflow)
                ================
               Integration Tests
              (Component Interaction)
            ========================
           Unit Tests (Core Functions)
         ==============================
```

### **Testing Principles**
1. **Test Early**: Validate components as they're built
2. **Test Often**: Continuous validation during development
3. **Test Real Data**: Use actual Excel files from various sources
4. **Test Edge Cases**: Handle all possible failure scenarios
5. **Test Performance**: Validate memory and speed requirements

## 🎯 Test Categories

### **1. Unit Testing**

#### **File Validation Functions**
```javascript
// Test: isValidFile()
describe('File Validation', () => {
  test('accepts valid Excel files', () => {
    const validFile = new File(['test'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    expect(isValidFile(validFile)).toBe(true);
  });

  test('rejects invalid file types', () => {
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    expect(isValidFile(invalidFile)).toBe(false);
  });

  test('rejects oversized files', () => {
    const largeFile = new File(['x'.repeat(100 * 1024 * 1024)], 'large.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    expect(isValidFile(largeFile)).toBe(false);
  });
});
```

#### **Markup Calculation Functions**
```javascript
// Test: calculateMarkup()
describe('Markup Calculations', () => {
  test('calculates correct markup percentages', () => {
    expect(calculateMarkup(100, 0.05)).toBe(105);
    expect(calculateMarkup(100, 0.10)).toBe(110);
    expect(calculateMarkup(100, 0.15)).toBe(115);
  });

  test('handles decimal inputs', () => {
    expect(calculateMarkup(99.99, 0.05)).toBeCloseTo(104.9895);
  });

  test('returns null for invalid inputs', () => {
    expect(calculateMarkup('invalid', 0.05)).toBe(null);
    expect(calculateMarkup(100, 'invalid')).toBe(null);
    expect(calculateMarkup(NaN, 0.05)).toBe(null);
  });
});
```

#### **Column Detection Functions**
```javascript
// Test: detectCostColumn()
describe('Column Detection', () => {
  test('finds standard cost columns', () => {
    const headers = ['Product', 'Cost', 'Description'];
    expect(detectCostColumn(headers)).toBe(1);
  });

  test('finds case-insensitive matches', () => {
    const headers = ['Product', 'UNIT PRICE', 'Description'];
    expect(detectCostColumn(headers)).toBe(1);
  });

  test('returns -1 when no cost column found', () => {
    const headers = ['Product', 'SKU', 'Description'];
    expect(detectCostColumn(headers)).toBe(-1);
  });
});
```

### **2. Integration Testing**

#### **File Processing Workflow**
```javascript
describe('File Processing Integration', () => {
  test('complete file processing workflow', async () => {
    // Given: A valid Excel file
    const testFile = await loadTestFile('sample-supplier.xlsx');
    
    // When: Processing the file
    const result = await processFile(testFile);
    
    // Then: Should return processed data
    expect(result.success).toBe(true);
    expect(result.workbook).toBeDefined();
    expect(result.costColumnIndex).toBeGreaterThan(-1);
    expect(result.markupColumns).toHaveLength(5);
  });

  test('handles multiple files in sequence', async () => {
    const files = await loadTestFiles(['supplier1.xlsx', 'supplier2.xlsx']);
    const results = await processMultipleFiles(files);
    
    expect(results).toHaveLength(2);
    expect(results.every(r => r.success)).toBe(true);
  });
});
```

#### **Master Workbook Generation**
```javascript
describe('Master Workbook Generation', () => {
  test('creates workbook with multiple sheets', async () => {
    const supplierData = await loadMultipleSupplierData();
    const masterWorkbook = await createMasterWorkbook(supplierData);
    
    expect(masterWorkbook.SheetNames).toHaveLength(supplierData.length);
    expect(masterWorkbook.SheetNames).toContain('supplier1');
    expect(masterWorkbook.SheetNames).toContain('supplier2');
  });
});
```

### **3. End-to-End Testing**

#### **Complete User Workflows**
```javascript
describe('End-to-End Workflows', () => {
  test('complete supplier price list merge', async () => {
    // 1. Upload files
    await uploadFiles(['supplier1.xlsx', 'supplier2.xlsx']);
    
    // 2. Verify files listed
    const fileList = getUploadedFilesList();
    expect(fileList).toHaveLength(2);
    
    // 3. Process files
    await clickProcessButton();
    
    // 4. Wait for completion
    await waitForProcessingComplete();
    
    // 5. Verify preview shows data
    const previewData = getPreviewData();
    expect(previewData.sheets).toHaveLength(2);
    
    // 6. Download master file
    await clickDownloadButton();
    
    // 7. Verify download triggered
    expect(downloadTriggered()).toBe(true);
  });
});
```

## 📊 Test Data Requirements

### **Sample Excel Files**

#### **1. Standard Supplier Files**
```
supplier1.xlsx:
- Product Name | SKU | Cost | Description
- Widget A     | W001| 10.50| Basic widget
- Widget B     | W002| 15.75| Premium widget

supplier2.xlsx:
- Item         | Code| Price| Notes
- Gadget X     | G001| 25.00| Electronic gadget
- Gadget Y     | G002| 30.50| Deluxe gadget
```

#### **2. Edge Case Files**
```
no-cost-column.xlsx:
- Product | SKU | Description
- Item A  | A001| Test item

mixed-data-types.xlsx:
- Product | Cost    | Notes
- Item A  | 10.50   | Valid
- Item B  | "Free"  | Text in cost column
- Item C  | (empty) | Empty cost cell

large-file.xlsx:
- 10,000+ rows of data
- Multiple worksheets
- Various data types
```

#### **3. Error Testing Files**
```
corrupted.xlsx: Intentionally corrupted file
empty.xlsx: File with no data
wrong-format.xls: Old Excel format
```

### **Test Data Generation**
```javascript
function generateTestData(rows = 100) {
  const data = [];
  for (let i = 1; i <= rows; i++) {
    data.push({
      'Product Name': `Product ${i}`,
      'SKU': `P${i.toString().padStart(4, '0')}`,
      'Cost': (Math.random() * 100 + 10).toFixed(2),
      'Description': `Test product ${i}`
    });
  }
  return data;
}
```

## 🔍 Testing Scenarios

### **Functional Testing Scenarios**

#### **File Upload Testing**
- [ ] Drag and drop single file
- [ ] Drag and drop multiple files
- [ ] Click to select files
- [ ] Upload maximum file size
- [ ] Upload invalid file types
- [ ] Upload corrupted files
- [ ] Remove uploaded files
- [ ] Clear all files

#### **Processing Testing**
- [ ] Process single supplier file
- [ ] Process multiple supplier files
- [ ] Process files with different structures
- [ ] Process files with missing cost columns
- [ ] Process files with invalid data
- [ ] Handle processing interruption
- [ ] Memory management during large file processing

#### **Output Testing**
- [ ] Download generated master file
- [ ] Verify worksheet names match supplier files
- [ ] Validate markup calculations accuracy
- [ ] Check data preservation
- [ ] Verify Excel file format compatibility

### **Error Handling Testing**

#### **File Validation Errors**
```javascript
const errorScenarios = [
  { file: 'document.pdf', expected: 'Invalid file type' },
  { file: 'huge-file.xlsx', expected: 'File too large' },
  { file: 'corrupted.xlsx', expected: 'File could not be read' }
];
```

#### **Processing Errors**
```javascript
const processingErrors = [
  { scenario: 'No cost column', expected: 'Warning: No cost column detected' },
  { scenario: 'Empty file', expected: 'Error: File contains no data' },
  { scenario: 'Invalid data', expected: 'Warning: Some values could not be processed' }
];
```

### **Performance Testing**

#### **Load Testing Scenarios**
- [ ] Process 10 files simultaneously
- [ ] Handle 50MB total file size
- [ ] Process 10,000 row spreadsheet
- [ ] Memory usage under load
- [ ] Browser responsiveness during processing

#### **Performance Benchmarks**
```javascript
const performanceTests = {
  fileUpload: { target: '< 1s', actual: null },
  smallFileProcessing: { target: '< 2s', actual: null },
  largeFileProcessing: { target: '< 10s', actual: null },
  downloadGeneration: { target: '< 3s', actual: null }
};
```

## 🖥️ Cross-Browser Testing

### **Browser Matrix**
| Browser | Version | Desktop | Mobile | Status |
|---------|---------|---------|--------|--------|
| Chrome  | 120+    | ✅      | ✅     | Pass   |
| Firefox | 115+    | ✅      | ✅     | Pass   |
| Safari  | 16+     | ✅      | ✅     | Pass   |
| Edge    | 120+    | ✅      | ✅     | Pass   |

### **Feature Compatibility Testing**
- [ ] FileReader API support
- [ ] Drag and drop functionality
- [ ] Blob download mechanism
- [ ] CSS Grid/Flexbox layout
- [ ] ES6+ JavaScript features

## 📱 Responsive Design Testing

### **Device Testing Matrix**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Large Mobile (414x896)

### **Responsive Features**
- [ ] File upload area scales appropriately
- [ ] Progress indicators remain visible
- [ ] Error messages display correctly
- [ ] Download button accessible
- [ ] Preview table scrolls horizontally

## 🔒 Security Testing

### **Client-Side Security**
- [ ] File type validation cannot be bypassed
- [ ] No XSS vulnerabilities in preview rendering
- [ ] Memory cleanup prevents data leaks
- [ ] No sensitive data exposure in browser storage

### **Input Validation Testing**
```javascript
const maliciousInputs = [
  '<script>alert("xss")</script>',
  'javascript:alert("xss")',
  '=cmd|"/c calc"',  // Excel formula injection
  '../../../etc/passwd'
];
```

## 📋 Test Execution Checklist

### **Pre-Development Testing**
- [ ] Test data prepared
- [ ] Testing environment set up
- [ ] Browser testing matrix defined
- [ ] Performance benchmarks established

### **During Development Testing**
- [ ] Unit tests pass for each component
- [ ] Integration tests validate component interaction
- [ ] Manual testing confirms UI functionality
- [ ] Performance monitoring shows acceptable metrics

### **Pre-Release Testing**
- [ ] End-to-end workflows tested
- [ ] Cross-browser compatibility verified
- [ ] Performance benchmarks met
- [ ] Security testing completed
- [ ] Error scenarios handled gracefully

## 🚨 Bug Tracking & Resolution

### **Bug Classification**
- **Critical**: Application crash, data loss, security vulnerability
- **High**: Core functionality broken, major UX issues
- **Medium**: Minor functionality issues, cosmetic problems
- **Low**: Enhancement requests, minor cosmetic issues

### **Bug Report Template**
```
Title: [Brief description]
Severity: [Critical/High/Medium/Low]
Browser: [Browser and version]
Steps to Reproduce:
1. [First step]
2. [Second step]
3. [Third step]

Expected Result: [What should happen]
Actual Result: [What actually happens]
Additional Info: [Screenshots, console errors, etc.]
```

## 📊 Test Metrics & Reporting

### **Coverage Metrics**
- **Unit Test Coverage**: Target 90%+ for core functions
- **Integration Test Coverage**: Target 80%+ for workflows
- **Browser Coverage**: Target 95%+ compatibility
- **Error Scenario Coverage**: Target 100% for known edge cases

### **Quality Metrics**
- **Bug Density**: < 1 bug per 100 lines of code
- **Performance**: All benchmarks met
- **User Experience**: 90%+ task completion rate
- **Reliability**: 99%+ success rate for valid inputs 