# KT_Project.path Module

## Index

- [Overview](#overview)
- [Path System](#path-system)
- [Path Methods](#path-methods)
    - [get()](#-get)
    - [resolve()](#-resolve)
    - [join()](#-join)
    - [parse()](#-parse)
    - [traverse()](#-traverse)
    - [getComps()](#-getcomps)
    - [getFolders()](#-getfolders)
    - [getSeparator()](#-getseparator)
    - [getParent()](#-getparent)
    - [getName()](#-getname)
    - [isAbsolute()](#-isabsolute)
    - [normalize()](#-normalize)
    - [getRelative()](#-getrelative)
    - [list()](#-list)
    - [getItem()](#-getitem)
    - [isPath()](#-ispath)
    - [decodeItemName()](#-decodeitemname)
- [Common Patterns](#common-patterns)

---

## Overview

The `path` module manages path utilities and enables navigation of the After Effects project hierarchy. It uses a custom path system with `//` separators to avoid conflicts with item names that may contain forward slashes.

### Key Features

- 🛤️ **Project path system** - Navigate using strings like `//FolderName//ItemName`
- 🔍 **Path resolution** - Convert path strings to actual project items
- 📂 **Recursive traversal** - Walk through entire project hierarchy
- 📊 **Item collection** - Filter items by type during traversal
- 🎯 **Path parsing** - Break down path strings into segments
- ✅ **Absolute paths** - All paths are relative to project root

---

## Path System

Paths use `//` as the separator to avoid conflicts with `/` in item names.

### Examples

```javascript
// Root item
"//ItemName";

// Nested items
"//FolderName//SubFolder//ItemName";

// Real examples
"//Comps//Main";
"//Assets//Footage//Videos//background.mov";
"//Project//Sequences//Scene_01//Timeline";
```

---

## Path Methods

### 📋 get

Returns the path string of an item.

**Arguments:**

| Parameter | Type           | Description              |
| --------- | -------------- | ------------------------ |
| `item`    | `_ItemClasses` | Item to get the path for |

**Returns:**

`string`

**Example:**

```javascript
// Get path of composition
const comp = KT_Project.find.comps("MainComp")[0];
const path = KT_Project.path.get(comp);
// Returns: "//Comps//MainComp"

// Get path of nested item
const itemPath = KT_Project.path.get(nestedItem);
$.writeln("Item path: " + itemPath);
```

---

### 📋 resolve

Resolves a path string to an actual project item.

**Arguments:**

| Parameter | Type                    | Description                          |
| --------- | ----------------------- | ------------------------------------ |
| `root`    | `Project \| FolderItem` | Root folder to start resolution from |
| `path`    | `string`                | Path string to resolve               |

**Returns:**

`_ItemClasses | null`

**Example:**

```javascript
// Resolve path to item
const item = KT_Project.path.resolve(app.project.rootFolder, "//Comps//MainComp");

if (item) {
    $.writeln("Found: " + item.name);
} else {
    $.writeln("Path not found");
}

// Resolve nested path
const nestedItem = KT_Project.path.resolve(app.project.rootFolder, "//Assets//Footage//Videos//background.mov");

// Resolve from specific folder
const assetsFolder = KT_Project.find.folders("Assets")[0];
const item = KT_Project.path.resolve(assetsFolder, "//Footage//video.mov");
```

---

### 📋 join

Joins path segments into a single path string.

**Arguments:**

| Parameter  | Type       | Description           |
| ---------- | ---------- | --------------------- |
| `...paths` | `string[]` | Path segments to join |

**Returns:**

`string`

**Example:**

```javascript
// Join path segments
const fullPath = KT_Project.path.join("Assets", "Footage", "video.mov");
// Returns: "Assets//Footage//video.mov"

// Build paths dynamically
const baseFolder = "Assets";
const subFolder = "Footage";
const filename = "background.mov";
const path = KT_Project.path.join(baseFolder, subFolder, filename);

//Deconstruct and rebuild path

const parsedPath = KT_Project.path.parse(fullPath); // -> ["Assets", "Footage", "video.mov"]
parsedPath.pop();
const videoFolderPath = KT_Project.path.join(...parsedPath); // -> "//Assets//Footage"
```

---

### 📋 parse

Parses a path string into individual segments.

**Arguments:**

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `path`    | `string` | Path string to parse |

**Returns:**

`string[]`

**Example:**

```javascript
// Parse path into segments
const segments = KT_Project.path.parse("//Comps//Sequences//MainComp");
// Returns: ["Comps", "Sequences", "MainComp"]

// Use segments for navigation
const path = "//Assets//Footage//Videos//video.mov";
const parts = KT_Project.path.parse(path);
for (let i = 0; i < parts.length; i++) {
    $.writeln("Segment " + i + ": " + parts[i]);
}
```

---

### 📋 traverse

Recursively traverses the project hierarchy calling a callback function for each item.

**Arguments:**

| Parameter  | Type                         | Description                    |
| ---------- | ---------------------------- | ------------------------------ |
| `root`     | `Project \| FolderItem`      | Root folder to start traversal |
| `callback` | `(item, collection) => void` | Function called for each item  |

**Returns:**

`void`

**Example:**

```javascript
// Traverse entire project
KT_Project.path.traverse(app.project, function (item, collection) {
    $.writeln("Item: " + item.name);
});

// Traverse specific folder
const assetsFolder = KT_Project.find.folders("Assets")[0];
KT_Project.path.traverse(assetsFolder, function (item, collection) {
    $.writeln("- " + item.name);
});

// Count items by type
let compCount = 0;
let folderCount = 0;
KT_Project.path.traverse(app.project, function (item, collection) {
    if (item instanceof CompItem) {
        compCount++;
    } else if (item instanceof FolderItem) {
        folderCount++;
    }
});
$.writeln("Comps: " + compCount + ", Folders: " + folderCount);
```

---

### 📋 getComps

Recursively finds all compositions matching a condition.

**Arguments:**

| Parameter | Type                    | Description               |
| --------- | ----------------------- | ------------------------- |
| `root`    | `Project \| FolderItem` | Root folder to start from |
| `matcher` | `(item) => boolean`     | Function to filter items  |

**Returns:**

`CompItem[]`

**Example:**

```javascript
// Get all compositions
const allComps = KT_Project.path.getComps(app.project, function (item) {
    return true; // Include all
});

// Get compositions with specific name
const comps = KT_Project.path.getComps(app.project, function (item) {
    return item.name.indexOf("Sequence") !== -1;
});

// Get high-resolution compositions
const hdComps = KT_Project.path.getComps(app.project, function (item) {
    return item.width >= 1920 && item.height >= 1080;
});
```

---

### 📋 getFolders

Recursively finds all folders matching a condition.

**Arguments:**

| Parameter | Type                    | Description               |
| --------- | ----------------------- | ------------------------- |
| `root`    | `Project \| FolderItem` | Root folder to start from |
| `matcher` | `(item) => boolean`     | Function to filter items  |

**Returns:**

`FolderItem[]`

**Example:**

```javascript
// Get all folders
const allFolders = KT_Project.path.getFolders(app.project, function (item) {
    return true; // Include all
});

// Get folders starting with "Archive"
const archiveFolders = KT_Project.path.getFolders(app.project, function (item) {
    return item.name.indexOf("Archive") === 0;
});

// Get empty folders
const emptyFolders = KT_Project.path.getFolders(app.project, function (item) {
    return item.numItems === 0;
});
```

---

---

### 📋 getSeparator

Returns the path separator used by the system ("//").

**Returns:**

`string`

---

### 📋 getParent

Returns the parent path of a given path string.

**Arguments:**

| Parameter | Type     | Description |
| --------- | -------- | ----------- |
| `path`    | `string` | Path string |

**Returns:**

`string`

---

### 📋 getName

Returns the last segment (name) of a path.

**Arguments:**

| Parameter | Type     | Description |
| --------- | -------- | ----------- |
| `path`    | `string` | Path string |

**Returns:**

`string`

---

### 📋 isAbsolute

Checks if a path starts with the separator.

**Arguments:**

| Parameter | Type     | Description |
| --------- | -------- | ----------- |
| `path`    | `string` | Path string |

**Returns:**

`boolean`

---

### 📋 normalize

Normalizes a path string, removing redundant separators.

**Arguments:**

| Parameter | Type     | Description |
| --------- | -------- | ----------- |
| `path`    | `string` | Path string |

**Returns:**

`string`

---

### 📋 getRelative

Calculates a relative path from one path to another.

**Arguments:**

| Parameter  | Type     | Description |
| ---------- | -------- | ----------- |
| `fromPath` | `string` | Start path  |
| `toPath`   | `string` | Target path |

**Returns:**

`string`

---

### 📋 list

Returns a list of all item paths within a root folder.

**Arguments:**

| Parameter | Type                    | Description                |
| --------- | ----------------------- | -------------------------- |
| `root`    | `Project \| FolderItem` | Root item to list contents |
| `prefix`  | `string`                | Optional prefix            |

**Returns:**

`string[]`

---

### 📋 getItem

Shorthand to resolve a path from project root.

**Arguments:**

| Parameter | Type     | Description        |
| --------- | -------- | ------------------ |
| `path`    | `string` | Absolute item path |

**Returns:**

`_ItemClasses | null`

---

### 📋 isPath

Checks if a string is a valid path format.

**Arguments:**

| Parameter | Type     | Description     |
| --------- | -------- | --------------- |
| `path`    | `string` | String to check |

**Returns:**

`boolean`

---

### 📋 decodeItemName

Decodes URL-encoded characters in item names.

**Arguments:**

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `name`    | `string` | Encoded name string |

**Returns:**

`string`

---

## Common Patterns

### Build Dynamic Paths

```javascript
// Construct path programmatically
const projectName = "MyProject";
const folderName = "Sequences";
const compName = "Scene_01";

const fullPath = KT_Project.path.join(projectName, folderName, compName);
const item = KT_Project.path.resolve(app.project.rootFolder, fullPath);
// Item -> "//MyProject//Sequences//Scene_01"
```

### Navigate Hierarchy with Paths

```javascript
// Move through folder structure using paths
const assetsPath = "Assets";
const footagePath = KT_Project.path.join(assetsPath, "Footage");
const videoPath = KT_Project.path.join(footagePath, "Videos");

const videoFolder = KT_Project.path.resolve(app.project.rootFolder, videoPath);
if (videoFolder) {
    $.writeln("Found folder with " + videoFolder.numItems + " items");
}
```

### Print Project Structure

```javascript
// Display complete project hierarchy
function printStructure(item, indent) {
    indent = indent || "";
    $.writeln(indent + item.name);
    if (item instanceof FolderItem) {
        for (let i = 1; i <= item.numItems; i++) {
            printStructure(item.item(i), indent + "  ");
        }
    }
}

KT_Project.path.traverse(app.project, function (item) {
    printStructure(item, "");
});
```

### Find Items by Complex Criteria

```javascript
// Collect high-resolution compositions
const resolutions = [];
KT_Project.path.traverse(app.project, function (item) {
    if (item instanceof CompItem && item.width >= 3840) {
        resolutions.push(item.name);
    }
});

$.writeln("4K+ Compositions: " + resolutions.join(", "));
```

### Safe Path Navigation

```javascript
// Safely navigate to deep paths
const path = KT_Project.path.join("Project", "Sequences", "Season_01", "Episode_01");
const item = KT_Project.path.resolve(app.project.rootFolder, path);

if (item) {
    const itemPath = KT_Project.path.get(item);
    $.writeln("Item path: " + itemPath);
} else {
    $.writeln("Path does not exist");
}
```
