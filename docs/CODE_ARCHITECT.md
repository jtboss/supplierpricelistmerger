# Supplier Price List Merger Application - Code Architect

Create a comprehensive web application for merging multiple Excel supplier price lists into one master spreadsheet. The application should be built as a single HTML file with embedded CSS and JavaScript.

## Core Requirements

### 1. File Upload System
- Drag and drop interface for Excel files (.xlsx, .xls)
- Multiple file selection capability
- File validation to ensure only Excel files are accepted
- Visual feedback for drag operations
- List of uploaded files with remove functionality
- File size and type display

### 2. Excel Processing
- Read multiple Excel files using SheetJS/XLSX library
- Parse each supplier's price list data
- Handle different Excel formats and structures
- Error handling for corrupted or invalid files

### 3. Master Spreadsheet Creation
- Create a new Excel workbook as the master file
- Each supplier gets their own worksheet in the master file
- Worksheet naming: use supplier filename as worksheet name
- Preserve original data structure from each supplier

### 4. Markup Calculations
- Automatically add 5 new columns to each worksheet:
  - 5% Markup
  - 10% Markup  
  - 15% Markup
  - 20% Markup
  - 30% Markup
- Calculate markup from the cost price column
- Formula: Markup Price = Cost Price × (1 + Markup Percentage)
- Handle different cost price column names (Cost, Price, Cost Price, Unit Price, etc.)

### 5. User Interface Design
- Modern, professional design with gradient backgrounds
- Responsive layout that works on desktop and mobile
- Progress indicator during file processing
- Status messages for success/error states
- Preview functionality to show sample of merged data
- Download button for the final master spreadsheet

### 6. Technical Specifications
- Single HTML file with embedded CSS and JavaScript
- Use SheetJS (XLSX) library from CDN: https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
- No external dependencies except for the XLSX library
- Client-side processing only (no server required)
- Cross-browser compatibility

### 7. Key Features to Include
- **Smart Column Detection**: Automatically find cost price columns even if they have different names
- **Data Validation**: Check for valid numeric values before calculating markups
- **Error Handling**: Graceful handling of file read errors, invalid data, etc.
- **Progress Tracking**: Show progress during file processing
- **File Management**: Easy removal of uploaded files before processing
- **Preview Mode**: Show a sample of the processed data before download
- **Responsive Design**: Works well on all screen sizes

### 8. Markup Calculation Logic
```javascript
// Example of markup calculation
const costPrice = parseFloat(cellValue);
const markup5 = costPrice * 1.05;   // 5% markup
const markup10 = costPrice * 1.10;  // 10% markup
const markup15 = costPrice * 1.15;  // 15% markup
const markup20 = costPrice * 1.20;  // 20% markup
const markup30 = costPrice * 1.30;  // 30% markup
```

### 9. File Structure Requirements
- Each supplier's data should maintain its original structure
- Add markup columns at the end of existing columns
- Preserve headers and formatting as much as possible
- Handle empty cells and non-numeric values gracefully

### 10. User Experience Flow
1. User drags/drops or selects Excel files
2. Files are validated and listed
3. User clicks "Merge Price Lists" button
4. Progress indicator shows processing status
5. Preview of merged data is displayed
6. User can download the master Excel file
7. Clear success message with summary of processed files

### 11. Error Handling
- Invalid file format warnings
- File read error messages
- Missing cost price column warnings
- Empty file handling
- Large file processing timeouts

### 12. Visual Design Guidelines
- Use modern CSS with gradients and shadows
- Implement hover effects and smooth transitions
- Color scheme: Professional blues and purples
- Clear typography and proper spacing
- Loading animations and progress indicators
- Mobile-responsive design

### 13. Advanced Features (Optional)
- Ability to customize markup percentages
- Option to rename worksheets before processing
- Data validation and cleanup
- Export summary report
- Batch processing status for multiple files

## Technical Implementation Notes
- Use FileReader API for reading uploaded files
- Implement proper async/await for file processing
- Use XLSX.utils functions for worksheet manipulation
- Implement proper memory management for large files
- Add comprehensive error handling and user feedback

## Output Format
The final application should be a single HTML file that can be opened in any modern web browser and work completely offline (except for loading the XLSX library from CDN).

Generate the complete, production-ready code with all functionality implemented and thoroughly tested error handling. 