# KT After Effects Project Tools

## 📑 Index of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Modules](#modules)
    - [find](#-find-module)
    - [add](#-add-module)
    - [import](#-import-module)
    - [move](#-move-module)
    - [remove](#-remove-module)
    - [duplicate](#-duplicate-module)
    - [path](#-path-module)
4. [Dependencies](#dependencies)
5. [Development](#development)

---

## Overview

🎬 **KT_Project** is a TypeScript library that provides comprehensive utilities for managing After Effects projects programmatically. It allows you to create, search, import, organize, and manipulate project elements with a clean and intuitive interface, designed for the KT ecosystem.

### Key Features

- ✅ **Search elements** by name, path, ID with support for regex and patterns
- ✅ **Create compositions, folders, and solids** with automatic validation and sanitization
- ✅ **Import media** from disk (folders, files, sequences) with flexible options
- ✅ **Organize projects** by moving, duplicating, and removing elements
- ✅ **Navigate projects** using an intuitive path system with `//` separators
- ✅ **Type-safe operations** with full TypeScript support
- ✅ **ExtendScript compatible** for Adobe After Effects scripting environment

---

## Quick Start

```javascript
import { KT_Project } from "kt-ae-project-tools";

// Create a new composition
const newComp = KT_Project.add.comp({
    name: "Main Timeline",
    width: 1920,
    height: 1080,
    frameRate: 30,
    duration: 30,
});

// Search for existing elements
const foundComps = KT_Project.find.comps("Timeline");
const allFolders = KT_Project.find.folders({ deep: true });

// Import media
const imported = KT_Project.import.videos({
    path: "/path/to/footage/",
    recursive: true,
});

// Move elements
KT_Project.move(newComp, parentFolder);

// Duplicate elements
const duplicated = KT_Project.duplicate.comps(newComp);

// Remove elements
KT_Project.remove.comp(newComp);

// Navigate using paths
const itemPath = KT_Project.path.get(newComp);
const resolved = KT_Project.path.resolve(app.project.rootFolder, "//MainFolder//SubFolder");
```

---

## Module Documentation

Detailed documentation for each module:

| Module           | File                                   | Description                        |
| ---------------- | -------------------------------------- | ---------------------------------- |
| 🔍 **find**      | [docs/find.md](docs/find.md)           | Search and filter project elements |
| ➕ **add**       | [docs/add.md](docs/add.md)             | Create new project elements        |
| 📥 **import**    | [docs/import.md](docs/import.md)       | Import external files and folders  |
| ↔️ **move**      | [docs/move.md](docs/move.md)           | Move elements within project       |
| 🗑️ **remove**    | [docs/remove.md](docs/remove.md)       | Remove elements from project       |
| 📋 **duplicate** | [docs/duplicate.md](docs/duplicate.md) | Duplicate existing elements        |
| 🛤️ **path**      | [docs/path.md](docs/path.md)           | Navigate and manage project paths  |

### 🔍 find Module

Powerful search and filtering utilities to locate elements in the project hierarchy.

**Key Methods:**

- `items()` - Search any element
- `comps()` - Search compositions
- `folders()` - Search folders
- `footage()`, `videos()`, `audios()`, `images()` - Search specific media types

[View full documentation →](docs/find.md)

### ➕ add Module

Create new project elements with automatic validation and sanitization of parameters.

**Key Methods:**

- `comp()` - Create a new composition
- `folder()` - Create a new folder
- `solid()` - Create a new solid

[View full documentation →](docs/add.md)

### 📥 import Module

Import external files and folders into your After Effects project with flexible options.

**Key Methods:**

- `files()` - Import individual files
- `folders()` - Import folder structures
- `videos()`, `audios()`, `images()` - Import specific media types
- `sequences()` - Import image sequences

[View full documentation →](docs/import.md)

### ↔️ move Module

Move elements within the project hierarchy to organize your workflow.

**Key Methods:**

- `move()` - Move elements to a destination folder

[View full documentation →](docs/move.md)

### 🗑️ remove Module

Remove elements from your project with type-specific methods.

**Key Methods:**

- `item()` - Remove any element
- `comp()`, `folder()`, `footage()`, `video()`, `audio()`, `image()`, `solid()` - Remove specific types

[View full documentation →](docs/remove.md)

### 📋 duplicate Module

Duplicate existing elements and maintain their properties and hierarchy.

**Key Methods:**

- `items()` - Duplicate any element
- `comps()`, `folders()`, `footage()` - Duplicate specific types

[View full documentation →](docs/duplicate.md)

### 🛤️ path Module

Navigate the project hierarchy using path strings with `//` separators for element names.

**Key Methods:**

- `get()` - Get the path string of an element
- `resolve()` - Resolve a path string to an element
- `traverse()` - Traverse elements recursively
- `parse()` - Parse a path string into segments

[View full documentation →](docs/path.md)

---

## Dependencies

- 📦 **kt-io** - File system and path utilities - [GitHub](https://github.com/Octopodo/kt-io)
- 📦 **kt-ae-is-checkers** - Type guards for After Effects items
- 📦 **kt-core** - Core framework utilities - [GitHub](https://github.com/Octopodo/kt-core)
- 🏛️ **types-for-adobe** - TypeScript definitions for After Effects API

---

## Development

### Build

```bash
npm run build
```

### Test Build

```bash
npm run build-tests
npm run debug-build-tests
```

**Created with ❤️ for the KT ecosystem**
