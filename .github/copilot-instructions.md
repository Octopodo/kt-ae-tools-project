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
- Uses testing suite repos: https://github.com/Octopodo/kt-testing-suite-core/tree/master and https://github.com/Octopodo/kt-testing-suite-ae
- In order to run tests, you need to import the current testing file on index.test.ts and comment the other test imports

## Code Patterns & Conventions

- **Comments**: Always write comments in english even if I ask you in another language
- **Naming**: Same as comments, always use english names for variables, functions, classes, etc.
- **Loops**: Use for loops instead of Array and Object Methods for compatibility with ExtendScript
- **Spreading**: Avoid using spread operator (`...`) on objects due to ExtendScript transpiler limitations. For arrays, spreading is acceptable.

### Naming & Structure

- **Private Methods**: Double underscore prefix (`__sanitizeCompValues`)
- **Singleton Pattern**: Classes like `__KT_ProjectAdd` instantiated as `const KT_ProjectAdd = new __KT_ProjectAdd()`
- **Type Definitions**: Inline interfaces for options objects (`CompOptions`, `FolderOptions`)

### After Effects API Usage

- **Global Objects**: Direct access to `app.project`, `$.writeln` (ExtendScript globals)
- **Item Types**: Uses `types-for-adobe` definitions (`CompItem`, `FolderItem`, `FootageItem`)
- **Collection Access**: `app.project.items` as default root for operations
- **Documentation Links**: References to AE scripting docs for method behaviors https://ae-scripting.docsforadobe.dev/ https://extendscript.docsforadobe.dev/

### Validation & Safety

- **Comp Creation**: Extensive bounds checking (width: 4-30000, height: 4-30000, etc.)
- **Type Safety**: Strict TypeScript with comprehensive type guards
- **Error Handling**: Methods return `Boolean | ItemType` to indicate success/failure

## Dependencies & Ecosystem

- **`kt-core`**: Framework foundation and module system that provides old js libs like json2.js https://github.com/Octopodo/kt-core
- **`kt-io`**: Path/file operations (imported in `import.ts`) https://github.com/Octopodo/kt-io/tree/master
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

## Donts

- Do not use modern JavaScript features unsupported by ExtendScript (e.g., Promises, async/await, certain ES6+ syntax)
- Do not use the spread operator on objects
- Do not use Array/Object methods that are incompatible with ExtendScript (e.g., forEach, map, filter)
- Do not write tests if you are not asked to
- Do not modify tsconfig.json or kt.config.json unless instructed
- Do not write docs if you are not asked to

## Writing docs

- Documentation consists on one md file at the root of the project and more detailed docs on docs folder for each module
- When writing docs for the root md file, write a brief project overview, some relevant examples of usage and links to the docs folder and other repos used in this project
- Follow the existing documentation style in the codebase
- When documenting functions always write a brief description, include parameter types, defaults(if any) and return types clearly in a table format
- Always include an index of contents at the start of the documentation file
- If a type is on this codebase, try to link to it using the format `{@link TypeName}`
- For document modules use the KT_Project.moduleName format to refer to them. Look at KT_Project.ts for reference
