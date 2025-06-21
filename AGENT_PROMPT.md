# Background Agent Prompt: Fix Missing Markup Columns

## 🎯 **Task Summary**

You are working on a **Supplier Price List Merger** application built with Next.js 15, TypeScript, and XLSX library. The app successfully processes Excel files and creates a master workbook, but **the core feature - adding markup columns - is not working**.

## 🚨 **Critical Issue**

**PROBLEM**: The app is supposed to add 5 markup columns (5%, 10%, 15%, 20%, 30%) to each supplier worksheet, but no markup columns are appearing in the output.

**EVIDENCE**: 
- ✅ Excel files are processed successfully
- ✅ Master workbook is created with individual sheets  
- ✅ Cost columns should be detected (e.g., "UNIT PRICE", "PRICE")
- ❌ **NO markup columns are added to any worksheet**

## 📋 **Your Mission**

1. **Debug why markup columns aren't being added**
2. **Fix the markup column functionality** 
3. **Ensure all unit tests pass**
4. **Verify with real Excel files that markup columns appear**

## 🔍 **Investigation Starting Points**

### **Key Files to Examine:**
- `src/lib/excel/processor.ts` - Cost column detection logic
- `src/lib/excel/masterWorkbook.ts` - Markup column addition logic  
- `src/app/page.tsx` - Integration between components
- `src/types/index.ts` - Constants and types

### **Unit Tests Created:**
- `src/__tests__/costColumnDetection.test.ts` - Test cost column detection
- `src/__tests__/markupColumns.test.ts` - Test markup calculations

### **Debugging Commands:**
```bash
# Run the specific tests
npm test costColumnDetection
npm test markupColumns

# Run all tests
npm test

# Start development server  
npm run dev
```

## 🔧 **Likely Root Causes**

1. **Cost column detection failing** - `detectCostColumn()` returning -1
2. **FileObject not updated** - `costColumnIndex` not being set correctly
3. **Markup addition not called** - `addMarkupColumns()` not being invoked
4. **Calculation errors** - `calculateMarkup()` function issues

## 📊 **Expected Behavior**

When user uploads Excel files with cost columns:
1. **Cost column detected** (console should show: "Best cost column match: Column X")
2. **Markup columns added** (5 new columns: "5% Markup", "10% Markup", etc.)
3. **Calculations correct** (cost * 1.05, cost * 1.10, etc.)
4. **Master workbook downloadable** with markup columns visible

## 🧪 **Testing Strategy**

1. **Run unit tests first** to isolate the issue:
   ```bash
   npm test costColumnDetection
   npm test markupColumns
   ```

2. **Add debug logging** to track the flow:
   ```typescript
   console.log('Cost column detected:', file.costColumnIndex)
   console.log('Adding markup columns for:', file.name)
   ```

3. **Test with real files** by running `npm run dev` and uploading Excel files

## ✅ **Success Criteria**

- [ ] Cost column detection unit tests pass
- [ ] Markup column addition unit tests pass  
- [ ] Console logs show cost columns being detected
- [ ] Console logs show markup columns being added
- [ ] Downloaded Excel file contains 5 markup columns per sheet
- [ ] Markup calculations are mathematically correct

## 📝 **Detailed Task File**

Read `MARKUP_COLUMNS_FIX_TASK.md` for comprehensive analysis, unit tests, and debugging instructions.

## 🚀 **Current Branch**

You are working on branch: `feature/markup-columns-fix`

Main branch is preserved with working Excel processing. Make all changes on this feature branch.

---

**START HERE**: Run the unit tests to see what's failing, then debug from there. The issue is likely in the cost column detection or the markup addition logic not being called properly. 