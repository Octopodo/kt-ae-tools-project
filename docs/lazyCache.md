# KT_LazyCache Module

## Index

- [Overview](#overview)
- [Architecture](#architecture)
- [Public Methods](#public-methods)
    - [init()](#-init)
    - [scan()](#-scan)
    - [scanSolids()](#-scansolids)
    - [refresh()](#-refresh)
    - [add()](#-add)
    - [remove()](#-remove)
    - [update()](#-update)
    - [clear()](#-clear)
- [Private Properties](#private-properties)
    - [\_initialized](#-initialized)
    - [\_projectItemCount](#-projectitemcount)
    - [\_solidsScanned](#-solidsscanned)
    - [Internal Stores](#internal-stores)
- [KT_CacheStore Class](#kt_cachestore-class)

---

## Overview

The `lazyCache` module implements a caching system for After Effects project items effectively. It minimizes ExtendScript API calls by maintaining internal indices for item IDs, names, and paths.

> [!NOTE]
> This is an internal module used by `KT_Project.find` and other modules. It is not exposed directly via the public `KT_Project` API.

---

## Architecture

The system consists of two main classes:

1.  **`KT_CacheStore`**: A generic storage class that maintains indices for a specific collection of items.
2.  **`KT_LazyCache`**: A singleton manager that holds multiple `KT_CacheStore` instances (global, comps, folders, footage, etc.) and orchestrates scanning and updates.

---

## Public Methods

### 📋 init

Initializes the cache if not already initialized or if item count has changed.

**Arguments:**

| Parameter | Type      | Description                   |
| --------- | --------- | ----------------------------- |
| `force`   | `boolean` | Force re-initialization (opt) |

**Returns:**

`void`

---

### 📋 scan

Performs a full scan of the project hierarchy and rebuilds all indices.

**Arguments:**

None

**Returns:**

`void`

---

### 📋 scanSolids

Specifically scans and indexes the "Solids" folder (often excluded from normal scans for performance).

**Arguments:**

None

**Returns:**

`void`

---

### 📋 refresh

Alias for `scan()`.

**Arguments:**

None

**Returns:**

`void`

---

### 📋 add

Adds an item to the global cache and the appropriate sub-caches (comps, folders, etc.).

**Arguments:**

| Parameter | Type           | Description |
| --------- | -------------- | ----------- |
| `item`    | `_ItemClasses` | Item to add |

**Returns:**

`void`

---

### 📋 remove

Removes an item from the global cache and all sub-caches.

**Arguments:**

| Parameter | Type           | Description    |
| --------- | -------------- | -------------- |
| `item`    | `_ItemClasses` | Item to remove |

**Returns:**

`void`

---

### 📋 update

Updates one or more items. Recalculates paths and handles folder cascades (if a folder moves, all children paths are updated).

**Arguments:**

| Parameter | Type                             | Description       |
| --------- | -------------------------------- | ----------------- |
| `items`   | `_ItemClasses \| _ItemClasses[]` | Item(s) to update |

**Returns:**

`void`

---

### 📋 clear

Clears all caches and resets initialization state.

**Arguments:**

None

**Returns:**

`void`

---

## Private Properties

### 🔒 \_initialized

Flag indicating if the cache has been built.

**Type:** `boolean`

---

### 🔒 \_projectItemCount

Tracks `app.project.numItems` to detect external changes (e.g., user added items manually) and trigger re-scans.

**Type:** `number`

---

### 🔒 \_solidsScanned

Flag indicating if the Solids folder has been scanned.

**Type:** `boolean`

---

### Internal Stores

The manager maintains several specialized `KT_CacheStore` instances:

| Property   | Type                          | Description                             |
| ---------- | ----------------------------- | --------------------------------------- |
| `allItems` | `KT_CacheStore<_ItemClasses>` | Store containing **every** item         |
| `comps`    | `KT_CacheStore<CompItem>`     | Store containing only Compositions      |
| `folders`  | `KT_CacheStore<FolderItem>`   | Store containing only Folders           |
| `footage`  | `KT_CacheStore<FootageItem>`  | All Footage (Video, Audio, Images, Sol) |
| `images`   | `KT_CacheStore<FootageItem>`  | Store containing only Images            |
| `audio`    | `KT_CacheStore<FootageItem>`  | Store containing only Audio             |
| `video`    | `KT_CacheStore<FootageItem>`  | Store containing only Video             |
| `solids`   | `KT_CacheStore<FootageItem>`  | Store containing only Solids            |

---

## KT_CacheStore Class

Atomic storage unit used internally by `KT_LazyCache`.

### Methods

#### 📋 add

Adds an item to the store indices.

**Arguments:**

| Parameter   | Type     | Description            |
| ----------- | -------- | ---------------------- |
| `item`      | `T`      | The item to add        |
| `knownPath` | `string` | Optional pre-calc path |

#### 📋 update

Updates an item's path in the store.

**Arguments:**

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| `item`    | `T`      | The item to update       |
| `newPath` | `string` | Optional new path string |

#### 📋 renamePathPrefix

Efficiently updates paths for multiple items when a parent folder is renamed or moved.

**Arguments:**

| Parameter   | Type     | Description         |
| ----------- | -------- | ------------------- |
| `oldPrefix` | `string` | The old path prefix |
| `newPrefix` | `string` | The new path prefix |

### Private Indices

| Property     | Type                        | Description                             |
| ------------ | --------------------------- | --------------------------------------- |
| `_byId`      | `{ [key: string]: T }`      | Map of `ID -> Item`                     |
| `_byName`    | `{ [key: string]: T[] }`    | Map of `Name -> Item[]`                 |
| `_byPath`    | `{ [key: string]: T }`      | Map of `Path -> Item`                   |
| `_pathsById` | `{ [key: string]: string }` | Map of `ID -> Path`                     |
| `_items`     | `T[]`                       | Flat array of all items                 |
| `_allNames`  | `string`                    | Optimization string for RegExp matching |
