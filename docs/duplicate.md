# KT_Project.duplicate Module

## Index

- [Overview](#overview)
- [Duplication Methods](#duplication-methods)
    - [items()](#-items)
    - [comps()](#-comps)
    - [folders()](#-folders)
    - [footage()](#-footage)
    - [videos()](#-videos)
    - [audio()](#-audio)
    - [images()](#-images)
    - [solids()](#-solids)
- [Common Patterns](#common-patterns)

---

## Overview

The `duplicate` module supports duplicating items within the After Effects project. It preserves item properties, parent folders, and can work with specific item types or any project item.

### Key Features

- 📋 **Duplicate individual items** - Create copies while preserving properties
- 📂 **Recursive folder duplication** - Duplicate folder structures with contents
- 🎯 **Type-specific methods** - Duplicate specific item types (Note: some specific type methods are currently placeholders)
- 🔍 **Path resolution** - Duplicate items using path strings
- 📊 **Batch operations** - Duplicate multiple items at once
- 📍 **Maintain hierarchy** - Preserve folder structure in duplicated items

---

## Duplication Methods

### 📋 items

Duplicates any project items.

**Arguments:**

| Parameter | Type                                                   | Description          |
| --------- | ------------------------------------------------------ | -------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string \| string[]` | Item(s) to duplicate |

**Returns:**

`_ItemClasses[]`

**Example:**

```javascript
// Duplicate single item
const duplicated = KT_Project.duplicate.items(comp);

// Duplicate multiple items
const items = [comp1, folder1, footage1];
const duplicates = KT_Project.duplicate.items(items);

// Duplicate using path
const compPath = KT_Project.path.join("CompositionName");
const duplicates = KT_Project.duplicate.items(compPath);

// Duplicate multiple by path
const comp1Path = KT_Project.path.join("Comp1");
const comp2Path = KT_Project.path.join("Comp2");
const duplicates = KT_Project.duplicate.items([comp1Path, comp2Path]);
```

---

### 📋 comps

Duplicates compositions in the project.

**Arguments:**

| Parameter | Type                                                   | Description                 |
| --------- | ------------------------------------------------------ | --------------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string \| string[]` | Composition(s) to duplicate |

**Returns:**

`CompItem[]`

**Example:**

```javascript
// Duplicate single composition
const dup = KT_Project.duplicate.comps(mainComp);

// Duplicate multiple compositions
const comps = KT_Project.find.comps({ deep: true });
const duplicates = KT_Project.duplicate.comps(comps);

// Duplicate composition by name
const duplicates = KT_Project.duplicate.comps("Main Timeline");

// Duplicate with verification
const duplicates = KT_Project.duplicate.comps(comp);
if (duplicates.length > 0) {
    $.writeln("Composition duplicated: " + duplicates[0].name);
}
```

---

### 📋 folders

Duplicates folder structures including their contents.

**Arguments:**

| Parameter | Type                                                   | Description            |
| --------- | ------------------------------------------------------ | ---------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string \| string[]` | Folder(s) to duplicate |

**Returns:**

`FolderItem[]`

**Example:**

```javascript
// Duplicate single folder (recursive)
const duplicatedFolder = KT_Project.duplicate.folders(assetsFolder);

// Duplicate multiple folders
const folders = KT_Project.find.folders({ deep: true });
const duplicates = KT_Project.duplicate.folders(folders);

// Duplicate folder by path
const assetsPath = KT_Project.path.join("Assets");
const duplicates = KT_Project.duplicate.folders(assetsPath);

// Duplicated folder maintains structure
if (duplicates.length > 0) {
    $.writeln("Folder duplicated with " + duplicates[0].numItems + " items");
}
```

---

### 📋 footage (Not Implemented)

Duplicates footage items.

**Arguments:**

| Parameter | Type                                                   | Description                  |
| --------- | ------------------------------------------------------ | ---------------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string \| string[]` | Footage item(s) to duplicate |

**Returns:**

`FootageItem[]`

**Example:**

```javascript
// Duplicate video footage
const duplicated = KT_Project.duplicate.footage(videoItem);

// Duplicate all footage
const allFootage = KT_Project.find.footage({ deep: true });
const duplicates = KT_Project.duplicate.footage(allFootage);

// Duplicate by path
const footagePath = KT_Project.path.join("Assets", "video.mov");
const duplicates = KT_Project.duplicate.footage(footagePath);
```

---

### 📋 videos (Not Implemented)

Duplicates video footage items.

**Arguments:**

| Parameter | Type                                                   | Description                |
| --------- | ------------------------------------------------------ | -------------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string \| string[]` | Video item(s) to duplicate |

**Returns:**

`FootageItem[]`

**Example:**

```javascript
// Duplicate single video
const dup = KT_Project.duplicate.videos(videoClip);

// Duplicate all videos
const videos = KT_Project.find.videos({ deep: true });
const duplicates = KT_Project.duplicate.videos(videos);
```

---

### 📋 audio (Not Implemented)

Duplicates audio footage items.

**Arguments:**

| Parameter | Type                                                   | Description                |
| --------- | ------------------------------------------------------ | -------------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string \| string[]` | Audio item(s) to duplicate |

**Returns:**

`FootageItem[]`

**Example:**

```javascript
// Duplicate audio file
const dup = KT_Project.duplicate.audio(audioClip);

// Duplicate all audio
const audios = KT_Project.find.audios({ deep: true });
const duplicates = KT_Project.duplicate.audio(audios);
```

---

### 📋 images (Not Implemented)

Duplicates image footage items.

**Arguments:**

| Parameter | Type                                                   | Description                |
| --------- | ------------------------------------------------------ | -------------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string \| string[]` | Image item(s) to duplicate |

**Returns:**

`FootageItem | FootageItem[] | false`

**Example:**

```javascript
// Duplicate image
const dup = KT_Project.duplicate.images(imageItem);

// Duplicate multiple images
const images = KT_Project.find.images({ deep: true });
const duplicates = KT_Project.duplicate.images(images);
```

---

### 📋 solids (Not Implemented)

Duplicates solid items.

**Arguments:**

| Parameter | Type                                                   | Description                |
| --------- | ------------------------------------------------------ | -------------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[] \| string \| string[]` | Solid item(s) to duplicate |

**Returns:**

`FootageItem | FootageItem[] | false`

**Example:**

```javascript
// Duplicate solid
const dup = KT_Project.duplicate.solids(solidItem);

// Duplicate all solids
const solids = KT_Project.find.solids({ deep: true });
const duplicates = KT_Project.duplicate.solids(solids);
```

---

## Common Patterns

### Create Composition Variants

```javascript
// Create multiple versions of a composition
const baseComp = KT_Project.find.comps("MainComp")[0];

const variants = [];
for (let i = 0; i < 3; i++) {
    const dup = KT_Project.duplicate.comps(baseComp);
    if (dup.length > 0) {
        dup[0].name = "MainComp_Variant_" + (i + 1);
        variants.push(dup[0]);
    }
}
```

### Duplicate and Reorganize

```javascript
// Duplicate items and organize in new folder
const itemsToDuplicate = KT_Project.find.comps({ deep: true });
const backupFolder = KT_Project.add.folder({ name: "Backup" });

const duplicates = KT_Project.duplicate.comps(itemsToDuplicate);

for (let i = 0; i < duplicates.length; i++) {
    KT_Project.move(duplicates[i], backupFolder);
}
```

### Batch Duplication

```javascript
// Duplicate all footage and create organized backup
const footage = KT_Project.find.footage({ deep: true });
const backupFolder = KT_Project.add.folder({ name: "Footage Backup" });

const duplicates = KT_Project.duplicate.footage(footage);

for (let i = 0; i < duplicates.length; i++) {
    KT_Project.move(duplicates[i], backupFolder);
}
```

### Duplicate Folder Structure

```javascript
// Duplicate complete folder hierarchy
const assetsFolder = KT_Project.find.folders("Assets")[0];
const duplicatedAssets = KT_Project.duplicate.folders(assetsFolder);

if (duplicatedAssets.length > 0) {
    // Rename the duplicated folder
    duplicatedAssets[0].name = "Assets Copy";
}
```

### Duplicate Items Using Custom Criteria

```javascript
// Duplicate only compositions longer than 5 seconds
const longComps = KT_Project.find.comps({
    check: function (item) {
        return item.duration > 5;
    },
    deep: true,
});

const duplicates = KT_Project.duplicate.comps(longComps);
const backupFolder = KT_Project.add.folder({ name: "Long Comps Backup" });

for (let i = 0; i < duplicates.length; i++) {
    KT_Project.move(duplicates[i], backupFolder);
}

// Duplicate high-resolution video footage
const highResVideos = KT_Project.find.videos({
    check: function (item) {
        return item.width >= 1920 && item.height >= 1080;
    },
    deep: true,
});

const videoCopies = KT_Project.duplicate.videos(highResVideos);
```

---

## Notes

- Duplicated items are placed in the same parent folder as the original
- Folder duplication is recursive - all contents are duplicated
- Duplicated items receive the name of the original (AE may append " copy")
- Use with `move` to reorganize duplicated items after creation
