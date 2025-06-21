# Project Context: Supplier Price List Merger

## 🎯 Mission
Create a production-grade web application that merges multiple Excel supplier price lists into one master spreadsheet with automatic markup calculations.

## 🏗️ Current Status
- ✅ **Phase 0**: Complete Next.js setup with Tesla-level engineering
- ✅ **Documentation**: 7 comprehensive docs in `/docs` folder
- ✅ **Infrastructure**: TypeScript, testing, Excel processing foundation
- ✅ **GitHub**: Repository deployed and ready
- 🔄 **Phase 1**: Ready to implement core Excel processing features

## 🚀 Tech Stack
```
Frontend:     Next.js 15 + TypeScript + Tailwind CSS
Excel:        XLSX library for client-side processing
UI:           Radix UI primitives + custom components
Testing:      Vitest + React Testing Library + Jest
State:        React hooks + context
Validation:   Zod schemas
```

## 📁 Key Files for Background Agents
```
src/
├── types/index.ts           # Complete TypeScript definitions
├── lib/excel/processor.ts   # Core Excel processing engine
├── components/              # React components
└── app/                     # Next.js pages

docs/
├── TECHNICAL_SPECIFICATION.md  # Architecture details
├── IMPLEMENTATION_PLAN.md      # 7-phase roadmap
├── ELON_MUSK_MVP_EXECUTION_PLAN.md # Mission-critical execution
└── CODING_STANDARDS.md         # Development standards
```

## 🎯 Core Features to Implement
1. **Drag & Drop Excel Upload** - Multiple file selection
2. **Smart Column Detection** - Automatic cost column identification
3. **Markup Calculations** - 5%, 10%, 15%, 20%, 30% markup options
4. **Master Workbook Generation** - Separate sheets per supplier
5. **Modern UI** - Responsive, accessible design

## 🧪 Testing Strategy
- **Unit Tests**: 500+ tests for business logic (90%+ coverage)
- **Integration Tests**: 50+ tests for component interactions
- **E2E Tests**: Complete user workflows
- **Performance**: Memory management and large file handling

## 🔧 Development Commands
```bash
npm run dev          # Start development server
npm run test         # Run unit tests
npm run test:watch   # Watch mode testing
npm run build        # Production build
npm run type-check   # TypeScript validation
```

## 📋 Next Immediate Tasks
1. Implement drag & drop file upload component
2. Create Excel file validation and parsing
3. Build smart column detection algorithm
4. Add markup calculation engine
5. Design master workbook generation

## 🎨 UI/UX Requirements
- Modern, clean interface with drag & drop zones
- Progress indicators for file processing
- Error handling with user-friendly messages
- Responsive design for all screen sizes
- Accessibility compliance (WCAG 2.1)

## 🔒 Constraints
- **Client-side only**: No server processing for security
- **Memory efficient**: Handle large Excel files gracefully
- **Cross-browser**: Support modern browsers
- **Performance**: Process files under 5 seconds for typical use cases 