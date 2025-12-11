/**
 * Path utilities for navigating After Effects project items.
 *
 * This module provides a robust path system for After Effects project navigation.
 * Paths use "//" as separator to avoid conflicts with "/" commonly used in item names.
 *
 * Path format:
 * - Root items: "//ItemName"
 * - Nested items: "//FolderName//SubFolderName//ItemName"
 *
 * All paths are absolute from the project root folder.
 */

import { KT_ProjectPath, KT_IPathAdapter } from "kt-core";

const KT_AePathAdapter: KT_IPathAdapter<_ItemClasses> = {
    separator: "//",
    isContainer: (item) => item instanceof FolderItem,
    getChildren: (item) => {
        if (item instanceof FolderItem) {
            const children: _ItemClasses[] = [];
            for (let i = 1; i <= item.numItems; i++) {
                children.push(item.item(i));
            }
            return children;
        }
        return [];
    },
    getName: (item) => item.name,
    getParent: (item) => {
        const parent = item.parentFolder;
        if (parent instanceof Project) return null;
        return parent;
    },
};

class __KT_AeProjectPath {}

const KT_AeProjectPath = new KT_ProjectPath<_ItemClasses>(KT_AePathAdapter);
export { KT_AeProjectPath };
