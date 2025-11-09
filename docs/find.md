# KT_Project.find Module

## Index

- [Overview](#overview)
- [Search Methods](#search-methods)
    - [items()](#items)
    - [comps()](#comps)
    - [folders()](#folders)
    - [footage()](#footage)
    - [videos()](#videos)
    - [audios()](#audios)
    - [images()](#images)
- [Common Patterns](#common-patterns)
- [Type Definitions](#type-definitions)
    - [FindProjectOptionParams](#findprojectoptionparams)

---

## Overview

The `find` module provides powerful search and filter utilities for locating items in the After Effects project hierarchy. It supports searching by name, path, regex patterns, item IDs, and more with flexible matching options.

### Key Features

- 🔍 **Search by name** - Exact match, regex, case-sensitive options
- 🛤️ **Search by path** - Find items using project path strings
- 📋 **Search by ID** - Locate items using their numeric IDs
- 🎯 **Pattern matching** - Use `startsWith`, `endsWith`, `contains` filters
- 🔄 **Recursive search** - Search deep into folder hierarchies with `deep` option
- 🏷️ **Type-specific searches** - Find comps, folders, footage, videos, audios, images

---

## Search Methods

### 📋 items

Searches for any items in the project matching the specified criteria.

**Arguments:**

| Parameter | Type                                                                                | Description                                                                 |
| --------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `options` | [`FindProjectOptionParams`](#findprojectoptionparams) \| string \| number \| RegExp | Search criteria as options object, name string, ID number, or regex pattern |

**Returns:**

`_ItemClasses[]`

**Search Options:**

| Option          | Type                                       | Default       | Description                      |
| --------------- | ------------------------------------------ | ------------- | -------------------------------- |
| `name`          | `string \| string[] \| RegExp \| RegExp[]` | None          | Item name(s) to search for       |
| `path`          | `string \| string[] \| RegExp \| RegExp[]` | None          | Item path(s) to search for       |
| `startsWith`    | `string \| string[] \| RegExp \| RegExp[]` | None          | Item names starting with         |
| `endsWith`      | `string \| string[] \| RegExp \| RegExp[]` | None          | Item names ending with           |
| `contains`      | `string \| string[] \| RegExp \| RegExp[]` | None          | Item names containing            |
| `id`            | `number \| number[]`                       | None          | Item ID(s)                       |
| `caseSensitive` | `boolean`                                  | `false`       | Enable case-sensitive matching   |
| `deep`          | `boolean`                                  | `false`       | Search recursively in subfolders |
| `root`          | `FolderItem`                               | `app.project` | Root folder to start search      |

**Example:**

```javascript
// Search by name
const items = KT_Project.find.items("MyItem");

// Search with options
const items = KT_Project.find.items({
    name: "Item",
    deep: true,
    caseSensitive: false,
});

// Search using regex
const items = KT_Project.find.items(/^Item_\d+$/);

// Search by ID
const items = KT_Project.find.items(42);
```

---

### 📋 comps

Searches for compositions in the project.

**Arguments:**

| Parameter | Type                                                                                | Description     |
| --------- | ----------------------------------------------------------------------------------- | --------------- |
| `options` | [`FindProjectOptionParams`](#findprojectoptionparams) \| string \| number \| RegExp | Search criteria |

**Returns:**

`CompItem[]`

**Example:**

```javascript
// Find all compositions
const allComps = KT_Project.find.comps({ deep: true });

// Find specific composition
const mainComp = KT_Project.find.comps("Main Composition")[0];

// Find compositions matching pattern
const sequenceComps = KT_Project.find.comps({
    startsWith: "Seq_",
    endsWith: "_Main",
    deep: true,
});
```

---

### 📋 folders

Searches for folders in the project.

**Arguments:**

| Parameter | Type                                                                                | Description     |
| --------- | ----------------------------------------------------------------------------------- | --------------- |
| `options` | [`FindProjectOptionParams`](#findprojectoptionparams) \| string \| number \| RegExp | Search criteria |

**Returns:**

`FolderItem[]`

**Example:**

```javascript
// Find all folders
const allFolders = KT_Project.find.folders({ deep: true });

// Find specific folder
const assetsFolder = KT_Project.find.folders("Assets")[0];

// Find folders containing "Footage"
const footageFolders = KT_Project.find.folders({
    contains: "Footage",
    deep: true,
});
```

---

### 📋 footage

Searches for footage items (images, videos, or audio).

**Arguments:**

| Parameter | Type                                                                                | Description     |
| --------- | ----------------------------------------------------------------------------------- | --------------- |
| `options` | [`FindProjectOptionParams`](#findprojectoptionparams) \| string \| number \| RegExp | Search criteria |

**Returns:**

`FootageItem[]`

**Example:**

```javascript
// Find all footage
const allFootage = KT_Project.find.footage({ deep: true });

// Find footage by name
const myFootage = KT_Project.find.footage("background.mov");
```

---

### 📋 videos

Searches for video footage items.

**Arguments:**

| Parameter | Type                                                                                | Description     |
| --------- | ----------------------------------------------------------------------------------- | --------------- |
| `options` | [`FindProjectOptionParams`](#findprojectoptionparams) \| string \| number \| RegExp | Search criteria |

**Returns:**

`FootageItem[]`

**Example:**

```javascript
// Find all videos
const allVideos = KT_Project.find.videos({ deep: true });

// Find specific video
const mainVideo = KT_Project.find.videos("main_footage")[0];
```

---

### 📋 audios

Searches for audio footage items.

**Arguments:**

| Parameter | Type                                                                                | Description     |
| --------- | ----------------------------------------------------------------------------------- | --------------- |
| `options` | [`FindProjectOptionParams`](#findprojectoptionparams) \| string \| number \| RegExp | Search criteria |

**Returns:**

`FootageItem[]`

**Example:**

```javascript
// Find all audio files
const allAudio = KT_Project.find.audios({ deep: true });

// Find background music
const music = KT_Project.find.audios("music")[0];
```

---

### 📋 images

Searches for image footage items.

**Arguments:**

| Parameter | Type                                                                                | Description     |
| --------- | ----------------------------------------------------------------------------------- | --------------- |
| `options` | [`FindProjectOptionParams`](#findprojectoptionparams) \| string \| number \| RegExp | Search criteria |

**Returns:**

`FootageItem[]`

**Example:**

```javascript
// Find all images
const allImages = KT_Project.find.images({ deep: true });

// Find PNG images
const pngImages = KT_Project.find.images({
    endsWith: ".png",
    deep: true,
});
```

---

## Common Patterns

### Search with Multiple Conditions

```javascript
// Find compositions starting with "Seq_" and ending with "_Main"
const results = KT_Project.find.comps({
    startsWith: "Seq_",
    endsWith: "_Main",
    deep: true,
});
```

### Case-Insensitive Search

```javascript
// Find items ignoring case
const results = KT_Project.find.items({
    name: "myitem",
    caseSensitive: false,
    deep: true,
});
```

### Search Using Regular Expressions

```javascript
// Find items matching a pattern
const results = KT_Project.find.comps(/^(BG|FG)_\d{3}$/);
```

### Search in Specific Root Folder

```javascript
// Search within a specific folder
const rootFolder = KT_Project.find.folders("Assets")[0];
const results = KT_Project.find.items({
    name: "Item",
    root: rootFolder,
    deep: true,
});
```

---

## Type Definitions

### FindProjectOptionParams

| Option          | Type                                       | Default | Description                      |
| --------------- | ------------------------------------------ | ------- | -------------------------------- |
| `name`          | `string \| string[] \| RegExp \| RegExp[]` | None    | Item name(s) to search for       |
| `path`          | `string \| string[] \| RegExp \| RegExp[]` | None    | Item path(s) to search for       |
| `startsWith`    | `string \| string[] \| RegExp \| RegExp[]` | None    | Item names starting with         |
| `endsWith`      | `string \| string[] \| RegExp \| RegExp[]` | None    | Item names ending with           |
| `contains`      | `string \| string[] \| RegExp \| RegExp[]` | None    | Item names containing            |
| `id`            | `number \| number[]`                       | None    | Item ID(s)                       |
| `caseSensitive` | `boolean`                                  | `false` | Enable case-sensitive matching   |
| `deep`          | `boolean`                                  | `false` | Search recursively in subfolders |
| `root`          | `FolderItem`                               | None    | Root folder to start search from |
