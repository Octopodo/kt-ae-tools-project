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

- ✅ **Type validation** - Ensure correct item types before removal
- 📊 **Flexible input** - Accept single items or arrays

---

## Removal Methods

### 📋 item

Removes any items from the project.

**Arguments:**

| Parameter | Type                             | Description       |
| --------- | -------------------------------- | ----------------- |
| `items`   | `_ItemClasses \| _ItemClasses[]` | Item(s) to remove |

**Returns:**

`boolean`

**Example:**

```javascript
// Remove single item
KT_Project.remove.item(comp);

// Remove multiple items
const items = [comp1, comp2, folder1];
KT_Project.remove.item(items);

// Verify removal
if (KT_Project.remove.item(item)) {
    $.writeln("Item removed successfully!");
}
```

---

### 📋 comp

Removes compositions from the project.

**Arguments:**

| Parameter | Type                             | Description              |
| --------- | -------------------------------- | ------------------------ |
| `items`   | `_ItemClasses \| _ItemClasses[]` | Composition(s) to remove |

**Returns:**

`boolean`

**Example:**

```javascript
// Remove single composition
KT_Project.remove.comp(mainComp);

// Remove multiple compositions
const comps = KT_Project.find.comps({ deep: true });
KT_Project.remove.comp(comps);
```

---

### 📋 folder

Removes folders from the project.

**Arguments:**

| Parameter | Type                             | Description         |
| --------- | -------------------------------- | ------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[]` | Folder(s) to remove |

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

| Parameter | Type                             | Description               |
| --------- | -------------------------------- | ------------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[]` | Footage item(s) to remove |

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

| Parameter | Type                             | Description             |
| --------- | -------------------------------- | ----------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[]` | Video item(s) to remove |

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

| Parameter | Type                             | Description             |
| --------- | -------------------------------- | ----------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[]` | Audio item(s) to remove |

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

| Parameter | Type                             | Description             |
| --------- | -------------------------------- | ----------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[]` | Image item(s) to remove |

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

| Parameter | Type                             | Description             |
| --------- | -------------------------------- | ----------------------- |
| `items`   | `_ItemClasses \| _ItemClasses[]` | Solid item(s) to remove |

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

// Remove specific items
const path1 = KT_Project.path.resolve(app.project, "//Comps//Unused_01");
const path2 = KT_Project.path.resolve(app.project, "//Comps//Unused_02");
const itemsToRemove = [path1, path2];

if (path1 && path2) {
KT_Project.remove.item(itemsToRemove);
}

````

### Remove Items Using Custom Filter

```javascript
// Remove compositions shorter than 2 seconds
const shortComps = KT_Project.find.comps({
    check: function (item) {
        return item.duration < 2;
    },
    deep: true,
});

KT_Project.remove.comp(shortComps);

// Remove unused footage larger than 500MB
const largeUnusedFootage = KT_Project.find.footage({
    check: function (item) {
        return item.width > 4000 && item.height > 4000;
    },
    deep: true,
});

KT_Project.remove.footage(largeUnusedFootage);
````

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
