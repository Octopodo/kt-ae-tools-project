# KT_Project.add Module

## Index

- [Overview](#overview)
- [Creation Methods](#creation-methods)
    - [comp()](#comp)
    - [folder()](#folder)
    - [solid()](#solid)
- [Configuration](#configuration)
- [Common Patterns](#common-patterns)
- [Type Definitions](#type-definitions)
    - [CompOptions](#compoptions)
    - [FolderOptions](#folderoptions)
    - [SolidOptions](#solidoptions)

---

## Overview

The `add` module allows creation of new project items such as compositions, folders, and solids. All created items are automatically validated and sanitized to ensure they meet After Effects constraints.

### Key Features

- ✅ **Create compositions** with automatic validation of dimensions and frame rate
- ✅ **Create folders** to organize your project structure
- ✅ **Create solids** as placeholder layers
- ✅ **Parameter sanitization** - Values are automatically bounded and validated
- ✅ **Parent folder assignment** - Automatically place items in specified folders
- ⚙️ **Sensible defaults** - Predefined values for common parameters

---

## Creation Methods

### 📋 comp

Creates a new composition in the project.

**Arguments:**

| Parameter | Type                          | Description                           |
| --------- | ----------------------------- | ------------------------------------- |
| `options` | [`CompOptions`](#compoptions) | Configuration for the new composition |

**Returns:**

`CompItem | false`

**Example:**

```javascript
// Create a basic composition
const comp = KT_Project.add.comp({
    name: "Main Timeline",
});

// Create a composition with custom settings
const comp = KT_Project.add.comp({
    name: "HD Sequence",
    width: 1920,
    height: 1080,
    frameRate: 30,
    duration: 60,
});

// Create a composition in a specific folder
const parentFolder = KT_Project.find.folders("Compositions")[0];
const comp = KT_Project.add.comp({
    name: "Scene 1",
    parentFolder: parentFolder,
    width: 4096,
    height: 2160,
    frameRate: 24,
});
```

---

### 📋 folder

Creates a new folder in the project.

**Arguments:**

| Parameter | Type                              | Description                      |
| --------- | --------------------------------- | -------------------------------- |
| `options` | [`FolderOptions`](#folderoptions) | Configuration for the new folder |

**Returns:**

`FolderItem | false`

**Example:**

```javascript
// Create a simple folder
const folder = KT_Project.add.folder({
    name: "Assets",
});

// Create a folder in a specific parent
const parentFolder = app.project.rootFolder;
const subfolder = KT_Project.add.folder({
    name: "Images",
    parentFolder: parentFolder,
});

// Create a folder using path reference
const folder = KT_Project.add.folder({
    name: "Compositions",
    parentFolder: "//Project",
});
```

---

### 📋 solid

Creates a new solid (placeholder layer) in the project.

**Arguments:**

| Parameter | Type                            | Description                     |
| --------- | ------------------------------- | ------------------------------- |
| `options` | [`SolidOptions`](#solidoptions) | Configuration for the new solid |

**Returns:**

`FootageItem | false`

**Example:**

```javascript
// Create a white solid
const whiteSolid = KT_Project.add.solid({
    name: "White Background",
    width: 1920,
    height: 1080,
});

// Create a colored solid
const redSolid = KT_Project.add.solid({
    name: "Red Layer",
    width: 1920,
    height: 1080,
    color: [1, 0, 0], // RGB [1, 0, 0] = Red
});

// Create a solid in a specific folder
const blackSolid = KT_Project.add.solid({
    name: "Black Background",
    parentFolder: assetsFolder,
    width: 1920,
    height: 1080,
    color: [0, 0, 0],
});
```

---

## Configuration

### Composition Constraints & Defaults

| Property     | Min     | Max          | Default   |
| ------------ | ------- | ------------ | --------- |
| Width        | 4 px    | 30000 px     | 1920 px   |
| Height       | 4 px    | 30000 px     | 1080 px   |
| Pixel Aspect | 0.1     | 10           | 1         |
| Frame Rate   | 1 fps   | 240 fps      | 25 fps    |
| Duration     | 1 frame | 36000 frames | 10 frames |

---

## Common Patterns

### Create Organized Project Structure

```javascript
// Create project folder structure
const projectFolder = KT_Project.add.folder({ name: "Project" });
const compsFolder = KT_Project.add.folder({
    name: "Compositions",
    parentFolder: projectFolder,
});
const assetsFolder = KT_Project.add.folder({
    name: "Assets",
    parentFolder: projectFolder,
});

// Create compositions in the structure
const mainComp = KT_Project.add.comp({
    name: "Main",
    parentFolder: compsFolder,
    width: 1920,
    height: 1080,
});
```

### Create Multiple Compositions with Default Settings

```javascript
const compNames = ["Scene 1", "Scene 2", "Scene 3"];
for (let i = 0; i < compNames.length; i++) {
    KT_Project.add.comp({ name: compNames[i] });
}
```

### Validate Composition Creation

```javascript
const comp = KT_Project.add.comp({
    name: "New Comp",
    width: 1920,
    height: 1080,
});

if (comp) {
    $.writeln("Composition created: " + comp.name);
} else {
    $.writeln("Failed to create composition");
}
```

---

## Type Definitions

### CompOptions

| Option         | Type                   | Default | Description                               |
| -------------- | ---------------------- | ------- | ----------------------------------------- |
| `name`         | `string`               | None    | Name of the composition (required)        |
| `parentFolder` | `FolderItem \| string` | None    | Parent folder (FolderItem or path string) |
| `width`        | `number`               | 1920    | Width in pixels (4-30000)                 |
| `height`       | `number`               | 1080    | Height in pixels (4-30000)                |
| `pixelAspect`  | `number`               | 1       | Pixel aspect ratio (0.1-10)               |
| `duration`     | `number`               | 10      | Duration in frames (1-36000)              |
| `frameRate`    | `number`               | 25      | Frame rate in fps (1-240)                 |

### FolderOptions

| Option         | Type                   | Default | Description                               |
| -------------- | ---------------------- | ------- | ----------------------------------------- |
| `name`         | `string`               | None    | Name of the folder (required)             |
| `parentFolder` | `FolderItem \| string` | None    | Parent folder (FolderItem or path string) |

### SolidOptions

| Option         | Type                       | Default     | Description                               |
| -------------- | -------------------------- | ----------- | ----------------------------------------- |
| `name`         | `string`                   | None        | Name of the solid (required)              |
| `parentFolder` | `FolderItem \| string`     | None        | Parent folder (FolderItem or path string) |
| `width`        | `number`                   | 1920        | Width in pixels (4-30000)                 |
| `height`       | `number`                   | 1080        | Height in pixels (4-30000)                |
| `pixelAspect`  | `number`                   | 1           | Pixel aspect ratio (0.1-10)               |
| `duration`     | `number`                   | 10          | Duration in frames (1-36000)              |
| `color`        | `[number, number, number]` | `[0, 0, 0]` | RGB color array (0-1 range each)          |
