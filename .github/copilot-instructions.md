# KT After Effects Project Tools - AI Agent Instructions

## Project Overview

This is a TypeScript library providing After Effects project management utilities within the KT ecosystem. It enables programmatic creation, finding, and importing of compositions, folders, and media assets in AE projects.

## Architecture & Key Components

### Core Module Structure

- **`KtProject.ts`**: Main singleton module that instantiates and exports `KT_Project` with `find`, `import`, and `add` submodules
- **ExtendScript Compatibility**: Targets ES3 with CommonJS modules for Adobe's scripting environment

### Functional Areas

- **`add.ts`**: Creates new project items with validation (comps use sanitized dimensions/framerate)
- **`find.ts`**: Searches project hierarchy (currently stubbed - returns `false`)
- **`import.ts`**: Imports external files/folders (currently stubbed - returns `false`)
- **`path.ts`**: Path utilities and recursive project traversal functions
- **`isUtils.ts`**: Type guards for AE item classification (`isComp`, `isFolder`, `isImage`, etc.)

## Development Workflow

### Build System

- **Primary Build**: `npm run build` → invokes `kt-build`
- **Test Builds**:
    - `npm run build-tests` → builds `src/tests/index.test.ts` to `dist.test/index.test.js` (minified)
    - `npm run debug-build-tests` → same build without minification
- **Configuration**: `kt.config.json` defines build inputs/outputs and options

### Testing

- Uses `kt-testing-suite-ts` framework
- Tests located in `src/tests/` (not `tests/` root)
- Import testing utilities: `describe`, `it`, `expect`, `runTests`, `beforeAll`, etc.

## Code Patterns & Conventions

### Naming & Structure

- **Private Methods**: Double underscore prefix (`__sanitizeCompValues`)
- **Singleton Pattern**: Classes like `__KT_ProjectAdd` instantiated as `const KT_ProjectAdd = new __KT_ProjectAdd()`
- **Type Definitions**: Inline interfaces for options objects (`CompOptions`, `FolderOptions`)

### After Effects API Usage

- **Global Objects**: Direct access to `app.project`, `$.writeln` (ExtendScript globals)
- **Item Types**: Uses `types-for-adobe` definitions (`CompItem`, `FolderItem`, `FootageItem`)
- **Collection Access**: `app.project.items` as default root for operations

### Validation & Safety

- **Comp Creation**: Extensive bounds checking (width: 4-30000, height: 4-30000, etc.)
- **Type Safety**: Strict TypeScript with comprehensive type guards
- **Error Handling**: Methods return `Boolean | ItemType` to indicate success/failure

## Dependencies & Ecosystem

- **`kt-core`**: Framework foundation and module system that provides old js libs like json2.js
- **`kt-io`**: Path/file operations (imported in `import.ts`)
- **`types-for-adobe`**: AE API type definitions (After Effects 23.0)
- **Build Tools**: `kt-extendscript-builder` for compilation

## Common Patterns

- **Project Traversal**: Use `traverseProject()` from `path.ts` for recursive operations
- **Item Filtering**: Combine `getComps()`/`getFolders()` with matcher functions
- **Path Building**: Custom `//` separator for AE project paths (not filesystem paths)
- **Stub Implementation**: New features start as methods returning `false` for API compatibility

## File Organization

- **Source**: `src/` contains all TypeScript source files
- **Tests**: `src/tests/` (not root-level `tests/`)
- **Build Output**: `dist/` for main build, `dist.test/` for test builds
- **Config**: `kt.config.json` for build configuration (not standard tools)</content>
  <parameter name="filePath">c:\work\dev\KT_aeft\kt-ae-project-tools\.github\copilot-instructions.md
