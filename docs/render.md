# KT_Project.render Module

## Index

- [Overview](#overview)
- [Render Methods](#render-methods)
    - [addToQueue()](#-addtoqueue)
    - [sendToAME()](#-sendtoame)
    - [toProResXQWithAlpha()](#-toproresxwithalpha)
- [Configuration](#configuration)
- [Type Definitions](#type-definitions)
    - [KT_RenderOptions](#kt_renderoptions)

---

## Overview

The `render` module handles adding compositions to the Render Queue and sending them to Adobe Media Encoder (AME). It simplifies the process of setting up render items with templates and output paths.

### Key Features

- 🎞️ **Add to Render Queue** - Easily add comps to AE's native render queue
- 🚀 **Send to AME** - Queue items in Adobe Media Encoder
- 📝 **Template Support** - Apply render settings and output module templates
- 🔄 **Batch Processing** - Handle multiple compositions at once

---

## Render Methods

### 📋 addToQueue

Adds compositions to the After Effects Render Queue.

**Arguments:**

| Parameter | Type                                    | Description          |
| --------- | --------------------------------------- | -------------------- |
| `options` | [`KT_RenderOptions`](#kt_renderoptions) | Render configuration |

**Returns:**

`RenderQueueItem[]`

**Example:**

```javascript
// Add single comp to RQ
KT_Project.render.addToQueue({
    comps: myComp,
    path: "/path/to/output_folder",
    template: "Lossless",
});

// Add multiple comps
KT_Project.render.addToQueue({
    comps: [comp1, comp2],
    path: "/path/to/render_folder",
});
```

---

### 📋 sendToAME

Adds compositions to the Render Queue and immediately queues them in Adobe Media Encoder.

**Arguments:**

| Parameter | Type                                    | Description          |
| --------- | --------------------------------------- | -------------------- |
| `options` | [`KT_RenderOptions`](#kt_renderoptions) | Render configuration |

**Returns:**

`RenderQueueItem[]`

**Example:**

```javascript
// Send to AME
KT_Project.render.sendToAME({
    comps: mainComp,
    path: "/path/to/renders",
    renderInmedately: true,
});
```

---

### 📋 toProResXQWithAlpha

Shortcut/Preset method to render using "Apple ProRes 4444 XQ with alpha" template.

**Arguments:**

| Parameter | Type                                    | Description          |
| --------- | --------------------------------------- | -------------------- |
| `options` | [`KT_RenderOptions`](#kt_renderoptions) | Render configuration |

**Returns:**

`RenderQueueItem[]`

**Example:**

```javascript
KT_Project.render.toProResXQWithAlpha({
    comps: graphicComp,
    path: "/path/to/delivery",
});
```

---

## Type Definitions

### KT_RenderOptions

| Option             | Type                     | Default                                   | Description                                   |
| ------------------ | ------------------------ | ----------------------------------------- | --------------------------------------------- |
| `comps`            | `CompItem \| CompItem[]` | None                                      | Composition(s) to render (required)           |
| `path`             | `string`                 | None                                      | Output directory path (required)              |
| `template`         | `string`                 | "H.264 - Match Render Settings - 40 Mbps" | Output Module template name                   |
| `renderInmedately` | `boolean`                | `false`                                   | Start rendering immediately (for AME)         |
| `AME`              | `boolean`                | `false`                                   | _Deprecated/Unused in current implementation_ |
