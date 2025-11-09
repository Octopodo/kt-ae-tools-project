# KT_Project.move Module

## Index

- [Overview](#overview)
- [Methods](#methods)
    - [move()](#move)
- [Common Patterns](#common-patterns)

---

## Overview

The `move` module enables moving items within the After Effects project hierarchy. It allows you to reorganize your project by relocating compositions, folders, and other items to different parent folders.

### Key Features

- ↔️ **Move single or multiple items** - Relocate one or many items at once
- 🎯 **Flexible destination** - Specify destination as FolderItem or path string
- 🔍 **Path resolution** - Automatically resolve path strings to actual items
- ✅ **Error handling** - Returns boolean to indicate success/failure
- 📂 **Batch operations** - Move arrays of items efficiently

---

## Methods

### 📋 move

Moves one or more items to a specified destination folder.

**Arguments:**

| Parameter     | Type                                       | Description                                          |
| ------------- | ------------------------------------------ | ---------------------------------------------------- |
| `items`       | `_ItemClasses \| _ItemClasses[] \| string` | Item(s) to move - single item, array, or path string |
| `destination` | `FolderItem \| string`                     | Target folder - FolderItem or path string            |

**Returns:**

`boolean`

**Example:**

```javascript
// Move single item to a folder
const success = KT_Project.move(comp, targetFolder);

// Move multiple items
const items = [comp1, comp2, comp3];
KT_Project.move(items, destinationFolder);

// Move using path strings
KT_Project.move("//Comps//OldComp", "//Comps//Organized");

// Move using mixed references
const items = ["//Item1", "//Item2"];
KT_Project.move(items, targetFolder);

// Verify move operation
if (KT_Project.move(comp, folder)) {
    $.writeln("Item moved successfully!");
} else {
    $.writeln("Failed to move item!");
}
```

---

## Common Patterns

### Organize Project Structure

```javascript
// Create organized structure
const compsFolder = KT_Project.add.folder({ name: "Compositions" });
const assetsFolder = KT_Project.add.folder({ name: "Assets" });

// Move existing items into folders
const existingComps = KT_Project.find.comps({ deep: true });
for (let i = 0; i < existingComps.length; i++) {
    KT_Project.move(existingComps[i], compsFolder);
}

const footage = KT_Project.find.footage({ deep: true });
for (let i = 0; i < footage.length; i++) {
    KT_Project.move(footage[i], assetsFolder);
}
```

### Move Items Between Folders

```javascript
// Find items in one folder
const oldFolder = KT_Project.find.folders("OldFolder")[0];
const newFolder = KT_Project.find.folders("NewFolder")[0];

if (oldFolder && newFolder) {
    const items = [];
    for (let i = 1; i <= oldFolder.numItems; i++) {
        items.push(oldFolder.item(i));
    }

    KT_Project.move(items, newFolder);
}
```

### Batch Reorganization

```javascript
// Reorganize project by moving items to categorized folders
const categoriesToOrganize = ["Video", "Audio", "Images"];

for (let c = 0; c < categoriesToOrganize.length; c++) {
    const category = categoriesToOrganize[c];
    const folder = KT_Project.add.folder({ name: category });

    // Move category-specific items
    if (category === "Video") {
        KT_Project.move(KT_Project.find.videos({ deep: true }), folder);
    } else if (category === "Audio") {
        KT_Project.move(KT_Project.find.audios({ deep: true }), folder);
    } else if (category === "Images") {
        KT_Project.move(KT_Project.find.images({ deep: true }), folder);
    }
}
```

### Move Using Path Resolution

```javascript
// Move items using path strings
KT_Project.move("//Comps//Scene1", "//Archive");

// Move to nested path
KT_Project.move("//Items//Sequence_001", "//Organization//Sequences//2024");
```

---

## Error Handling

The `move` method returns `boolean` to indicate success:

```javascript
const success = KT_Project.move(item, folder);

if (success) {
    $.writeln("Operation succeeded");
} else {
    $.writeln("Operation failed - check item path and destination");
}
```

### Common Failure Cases

- Invalid item path or item doesn't exist
- Invalid destination path or not a folder
- Item cannot be moved to destination (e.g., item is the root or destination is invalid)
- Invalid destination folder reference
