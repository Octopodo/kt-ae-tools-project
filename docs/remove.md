# KT_Project.remove Module

## Index

- [Overview](#overview)
- [Removal Methods](#removal-methods)
    - [item()](#-item)
    - [comp()](#-comp)
    - [folder()](#-folder)
    - [footage()](#-footage)
    - [video()](#-video)
    - [audio()](#-audio)
    - [image()](#-image)
    - [solid()](#-solid)
- [Common Patterns](#common-patterns)

---

## Overview

The `remove` module provides utilities for removing items from the After Effects project. It offers both type-specific removal methods and general-purpose item removal with validation.

### Key Features

- 🗑️ **Remove individual or batch items** - Delete single or multiple items
- 🎯 **Type-specific methods** - Remove specific item types (comps, folders, footage, etc.)
- 🔍 **Path resolution** - Remove items using path strings
- ✅ **Type validation** - Ensure correct item types before removal
- 📊 **Flexible input** - Accept items, arrays, or path strings

---

## Removal Methods

### 📋 item

Removes any items from the project.

**Arguments:**

| Parameter | Type                                       | Description       |
| --------- | ------------------------------------------ | ----------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string` | Item(s) to remove |

**Returns:**

`boolean`

**Example:**

```javascript
// Remove single item
KT_Project.remove.item(comp);

// Remove multiple items
const items = [comp1, comp2, folder1];
KT_Project.remove.item(items);

// Remove using path
const itemPath = KT_Project.path.join("CompositionToDelete");
KT_Project.remove.item(itemPath);

// Verify removal
if (KT_Project.remove.item(item)) {
    $.writeln("Item removed successfully!");
}
```

---

### 📋 comp

Removes compositions from the project.

**Arguments:**

| Parameter | Type                                       | Description              |
| --------- | ------------------------------------------ | ------------------------ |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string` | Composition(s) to remove |

**Returns:**

`boolean`

**Example:**

```javascript
// Remove single composition
KT_Project.remove.comp(mainComp);

// Remove multiple compositions
const comps = KT_Project.find.comps({ deep: true });
KT_Project.remove.comp(comps);

// Remove by path
const compPath = KT_Project.path.join("Sequences", "Scene_01");
KT_Project.remove.comp(compPath);
```

---

### 📋 folder

Removes folders from the project.

**Arguments:**

| Parameter | Type                                       | Description         |
| --------- | ------------------------------------------ | ------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string` | Folder(s) to remove |

**Returns:**

`boolean`

**Example:**

```javascript
// Remove empty folder
KT_Project.remove.folder(emptyFolder);

// Remove multiple folders
const oldFolders = KT_Project.find.folders("Archive");
KT_Project.remove.folder(oldFolders);

// Remove by path
const folderPath = KT_Project.path.join("Unused", "OldComps");
KT_Project.remove.folder(folderPath);
```

---

### 📋 footage

Removes footage items from the project.

**Arguments:**

| Parameter | Type                                       | Description               |
| --------- | ------------------------------------------ | ------------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string` | Footage item(s) to remove |

**Returns:**

`boolean`

**Example:**

```javascript
// Remove single footage item
KT_Project.remove.footage(videoItem);

// Remove all unused footage
const allFootage = KT_Project.find.footage({ deep: true });
KT_Project.remove.footage(allFootage);
```

---

### 📋 video

Removes video footage items from the project.

**Arguments:**

| Parameter | Type                                       | Description             |
| --------- | ------------------------------------------ | ----------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string` | Video item(s) to remove |

**Returns:**

`boolean`

**Example:**

```javascript
// Remove video item
KT_Project.remove.video(videoClip);

// Remove all videos in project
const allVideos = KT_Project.find.videos({ deep: true });
KT_Project.remove.video(allVideos);
```

---

### 📋 audio

Removes audio footage items from the project.

**Arguments:**

| Parameter | Type                                       | Description             |
| --------- | ------------------------------------------ | ----------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string` | Audio item(s) to remove |

**Returns:**

`boolean`

**Example:**

```javascript
// Remove audio item
KT_Project.remove.audio(audioClip);

// Remove all audio
const allAudio = KT_Project.find.audios({ deep: true });
KT_Project.remove.audio(allAudio);
```

---

### 📋 image

Removes image footage items from the project.

**Arguments:**

| Parameter | Type                                       | Description             |
| --------- | ------------------------------------------ | ----------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string` | Image item(s) to remove |

**Returns:**

`boolean`

**Example:**

```javascript
// Remove image item
KT_Project.remove.image(imageItem);

// Remove all images
const allImages = KT_Project.find.images({ deep: true });
KT_Project.remove.image(allImages);
```

---

### 📋 solid

Removes solid items from the project.

**Arguments:**

| Parameter | Type                                       | Description             |
| --------- | ------------------------------------------ | ----------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string` | Solid item(s) to remove |

**Returns:**

`boolean`

**Example:**

```javascript
// Remove solid item
KT_Project.remove.solid(whiteSolid);

// Remove all solids
const solids = KT_Project.find.solids({ deep: true });
KT_Project.remove.solid(solids);
```

---

## Common Patterns

### Remove Unused Items

```javascript
// Remove all compositions (be careful!)
const allComps = KT_Project.find.comps({ deep: true });
const success = KT_Project.remove.comp(allComps);

if (success) {
    $.writeln("All compositions removed");
}
```

### Remove Items by Pattern

```javascript
// Remove all comps starting with "OLD_"
const oldComps = KT_Project.find.comps({
    startsWith: "OLD_",
    deep: true,
});

KT_Project.remove.comp(oldComps);
```

### Selective Cleanup

```javascript
// Remove specific types of unused footage
const unusedVideos = KT_Project.find.videos({ deep: true });
const unusedAudio = KT_Project.find.audios({ deep: true });

KT_Project.remove.video(unusedVideos);
KT_Project.remove.audio(unusedAudio);

$.writeln("Cleanup complete!");
```

### Remove Items Using Paths

```javascript
// Remove specific items by path
const path1 = KT_Project.path.join("Comps", "Unused_01");
const path2 = KT_Project.path.join("Comps", "Unused_02");
const path3 = KT_Project.path.join("Assets", "OldFootage");
const pathsToRemove = [path1, path2, path3];

for (let i = 0; i < pathsToRemove.length; i++) {
    KT_Project.remove.item(pathsToRemove[i]);
}
```

---

## Error Handling

The `remove` methods return `boolean` indicating success:

```javascript
if (KT_Project.remove.comp(item)) {
    $.writeln("Removal successful");
} else {
    $.writeln("Removal failed");
}
```

### Notes

- Returns `false` if removal fails for any item in the batch
- Type validation is performed - items must match the method type
- Use `.item()` for removing items regardless of type
