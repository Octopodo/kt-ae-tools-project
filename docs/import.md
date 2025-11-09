# KT_Project.import Module

## Index

- [Overview](#overview)
- [Import Methods](#import-methods)
    - [files()](#-files)
    - [folders()](#-folders)
    - [videos()](#-videos)
    - [audios()](#-audios)
    - [images()](#-images)
    - [sequences()](#-sequences)
    - [footage()](#-footage)
- [Configuration](#configuration)
- [Common Patterns](#common-patterns)
- [Type Definitions](#type-definitions)
    - [KT_ImportParams](#kt_importparams)

---

## Overview

The `import` module handles importing external files and folders into the After Effects project. It provides flexible options for importing media with support for recursive folder structures, file type filtering, and custom organization.

### Key Features

- 📥 **Import individual files** - Add media from disk to your project
- 📂 **Import folder structures** - Recursively import directories
- 🎬 **Import specific media types** - Videos, audios, images, sequences, or general footage
- 🎯 **File validation** - Automatic file extension checking
- 📋 **Flexible organization** - Options for flat or hierarchical imports
- 🔄 **Batch operations** - Import multiple items with a single call

---

## Import Methods

### 📋 files

Imports individual files with automatic extension validation.

**Arguments:**

| Parameter | Type                                  | Description                          |
| --------- | ------------------------------------- | ------------------------------------ |
| `options` | [`KT_ImportParams`](#kt_importparams) | Import configuration or file path(s) |

**Returns:**

`_ItemClasses[]`

**Example:**

```javascript
// Import a single file
const items = KT_Project.import.files("/path/to/video.mov");

// Import multiple files
const items = KT_Project.import.files({
    path: ["/path/file1.mov", "/path/file2.mov"],
});

// Import into specific folder
const items = KT_Project.import.files({
    path: "/path/to/file.mp4",
    parent: footageFolder,
});
```

---

### 📋 folders

Imports folder structures maintaining hierarchy or flattened.

**Arguments:**

| Parameter | Type                                  | Description                            |
| --------- | ------------------------------------- | -------------------------------------- |
| `options` | [`KT_ImportParams`](#kt_importparams) | Import configuration or folder path(s) |

**Returns:**

`_ItemClasses[]`

**Example:**

```javascript
// Import folder structure recursively
const items = KT_Project.import.folders({
    path: "/path/to/folder",
    recursive: true,
});

// Import folder hierarchy into project folder
const items = KT_Project.import.folders({
    path: "/path/to/folder",
    recursive: true,
    parent: projectFolder,
});

// Import folder contents flattened
const items = KT_Project.import.folders({
    path: "/path/to/folder",
    flat: true,
    recursive: true,
});
```

---

### 📋 videos

Imports video files with automatic type validation.

**Arguments:**

| Parameter | Type                                  | Description                          |
| --------- | ------------------------------------- | ------------------------------------ |
| `options` | [`KT_ImportParams`](#kt_importparams) | Import configuration or file path(s) |

**Returns:**

`_ItemClasses[]`

**Example:**

```javascript
// Import a single video
const videos = KT_Project.import.videos("/path/to/video.mov");

// Import multiple videos
const videos = KT_Project.import.videos({
    path: "/path/to/video/folder",
    recursive: true,
});

// Import videos into specific folder
const videos = KT_Project.import.videos({
    path: "/path/to/footage",
    parent: videoFolder,
    recursive: true,
});
```

---

### 📋 audios

Imports audio files with automatic type validation.

**Arguments:**

| Parameter | Type                                  | Description                          |
| --------- | ------------------------------------- | ------------------------------------ |
| `options` | [`KT_ImportParams`](#kt_importparams) | Import configuration or file path(s) |

**Returns:**

`_ItemClasses[]`

**Example:**

```javascript
// Import audio files
const audios = KT_Project.import.audios({
    path: "/path/to/audio/folder",
    recursive: true,
});

// Import audio into specific folder
const audios = KT_Project.import.audios({
    path: "/path/to/music.wav",
    parent: audioFolder,
});
```

---

### 📋 images

Imports image files with automatic type validation.

**Arguments:**

| Parameter | Type                                  | Description                          |
| --------- | ------------------------------------- | ------------------------------------ |
| `options` | [`KT_ImportParams`](#kt_importparams) | Import configuration or file path(s) |

**Returns:**

`_ItemClasses[]`

**Example:**

```javascript
// Import all images from folder
const images = KT_Project.import.images({
    path: "/path/to/images",
    recursive: true,
});

// Import single image
const images = KT_Project.import.images("/path/to/background.png");

// Import images into organized folder
const images = KT_Project.import.images({
    path: "/path/to/images",
    parent: imagesFolder,
});
```

---

### 📋 sequences

Imports image sequences with automatic detection.

**Arguments:**

| Parameter | Type                                  | Description                              |
| --------- | ------------------------------------- | ---------------------------------------- |
| `options` | [`KT_ImportParams`](#kt_importparams) | Import configuration or sequence path(s) |

**Returns:**

`_ItemClasses[]`

**Example:**

```javascript
// Import image sequence
const sequences = KT_Project.import.sequences({
    path: "/path/to/sequence",
    recursive: true,
});

// Import sequence into footage folder
const sequences = KT_Project.import.sequences({
    path: "/path/to/image_sequence_001.png",
    parent: footageFolder,
});
```

---

### 📋 footage

Imports all valid footage types (images, videos, audio, sequences).

**Arguments:**

| Parameter | Type                                  | Description                     |
| --------- | ------------------------------------- | ------------------------------- |
| `options` | [`KT_ImportParams`](#kt_importparams) | Import configuration or path(s) |

**Returns:**

`_ItemClasses[]`

**Example:**

```javascript
// Import all footage from folder
const footage = KT_Project.import.footage({
    path: "/path/to/all/media",
    recursive: true,
});

// Import footage into organized structure
const footage = KT_Project.import.footage({
    path: "/path/to/assets",
    recursive: true,
    parent: assetsFolder,
});
```

---

## Configuration

### Import Options

| Option          | Type                   | Default | Description                                    |
| --------------- | ---------------------- | ------- | ---------------------------------------------- |
| `path`          | `string \| string[]`   | None    | File or folder path(s) to import               |
| `recursive`     | `boolean`              | `false` | Import nested folders                          |
| `flat`          | `boolean`              | `false` | Import without maintaining hierarchy           |
| `parent`        | `FolderItem \| string` | None    | Parent folder for imported items               |
| `importAs`      | `string`               | None    | Force import type: "footage", "comp", "folder" |
| `toComp`        | `boolean`              | `false` | Import footage as new composition              |
| `asSequence`    | `boolean`              | `false` | Import images as sequence                      |
| `footageFolder` | `FolderItem \| string` | None    | Folder for footage                             |
| `compFolder`    | `FolderItem \| string` | None    | Folder for compositions                        |
| `importOptions` | `ImportOptions`        | None    | Additional AE import options                   |

---

## Common Patterns

### Import Project Assets

```javascript
// Create organized asset structure
const assetsFolder = KT_Project.add.folder({ name: "Assets" });
const footageFolder = KT_Project.add.folder({
    name: "Footage",
    parentFolder: assetsFolder,
});
const audioFolder = KT_Project.add.folder({
    name: "Audio",
    parentFolder: assetsFolder,
});

// Import media
const videos = KT_Project.import.videos({
    path: "/media/footage",
    recursive: true,
    parent: footageFolder,
});

const audios = KT_Project.import.audios({
    path: "/media/audio",
    recursive: true,
    parent: audioFolder,
});
```

### Batch Import Multiple Folders

```javascript
const folders = ["/path/to/folder1", "/path/to/folder2", "/path/to/folder3"];
const allItems = KT_Project.import.footage({
    path: folders,
    recursive: true,
    parent: mainAssetsFolder,
});
```

### Import Flat Structure

```javascript
// Import all contents without folder hierarchy
const items = KT_Project.import.footage({
    path: "/complex/folder/structure",
    recursive: true,
    flat: true,
    parent: flatFolder,
});
```

---

## Type Definitions

### KT_ImportParams

`KT_ImportParams` can be either a string/array of paths or a full options object:

```typescript
type KT_ImportParams = KT_ImportOptionsParams | string | string[];
```

### KT_ImportOptionsParams

| Option          | Type                   | Default | Description                                    |
| --------------- | ---------------------- | ------- | ---------------------------------------------- |
| `path`          | `string \| string[]`   | None    | File or folder path(s) to import (required)    |
| `recursive`     | `boolean`              | `false` | Import nested folders                          |
| `flat`          | `boolean`              | `true`  | Import without maintaining hierarchy           |
| `parent`        | `FolderItem \| string` | None    | Parent folder for imported items               |
| `importAs`      | `string`               | None    | Force import type: "footage", "comp", "folder" |
| `toComp`        | `boolean`              | `false` | Import footage as new composition              |
| `asSequence`    | `boolean`              | `false` | Import images as sequence                      |
| `footageFolder` | `FolderItem \| string` | None    | Folder for footage                             |
| `compFolder`    | `FolderItem \| string` | None    | Folder for compositions                        |
| `importOptions` | `ImportOptions`        | None    | Additional After Effects import options        |
