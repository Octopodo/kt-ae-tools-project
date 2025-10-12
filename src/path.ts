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

class __KT_AeProjectPath {
    private separator = "//";

    get(item: _ItemClasses): string {
        const parts: string[] = [];
        let current: _ItemClasses = item;
        while (
            current.parentFolder &&
            !(current.parentFolder instanceof Project)
        ) {
            parts.unshift(current.name);
            current = current.parentFolder as _ItemClasses;
        }
        // Do not include the rootFolder name
        return this.separator + parts.join(this.separator);
    }

    join(...paths: string[]): string {
        return paths.join(this.separator);
    }

    traverse(
        root: Project | FolderItem,
        callback: (item: _ItemClasses, collection: ItemCollection) => void = (
            item,
            collection
        ) => {}
    ) {
        const length = root.numItems;

        for (let i = 1; i <= length; i++) {
            const item = root.item(i);
            callback(item, root.items);
            if (item instanceof FolderItem) {
                this.traverse(item, callback);
            }
        }
    }

    getComps(
        root: Project | FolderItem,
        matcher: (item: _ItemClasses) => boolean
    ): CompItem[] {
        const comps: CompItem[] = [];
        this.traverse(root, (item, collection) => {
            if (item instanceof CompItem && matcher(item)) {
                comps.push(item);
            }
        });
        return comps;
    }

    getFolders(
        root: Project | FolderItem,
        matcher: (item: _ItemClasses) => boolean
    ): FolderItem[] {
        const folders: FolderItem[] = [];
        this.traverse(root, (item, collection) => {
            if (item instanceof FolderItem && matcher(item)) {
                folders.push(item);
            }
        });
        return folders;
    }

    parse(path: string): string[] {
        // Split by "//" and filter out empty strings
        const segments = path.split(this.separator);
        const result: string[] = [];
        for (let i = 0; i < segments.length; i++) {
            if (segments[i].length > 0) {
                result.push(segments[i]);
            }
        }
        return result;
    }

    resolve(root: Project | FolderItem, path: string): _ItemClasses | null {
        const segments = this.parse(path);
        let current: Project | FolderItem = root;

        for (const segment of segments) {
            if (
                !(current instanceof FolderItem) &&
                !(current instanceof Project)
            ) {
                return null; // Invalid, not a container
            }

            let found: _ItemClasses | null = null;
            const numItems = current.numItems;
            for (let i = 1; i <= numItems; i++) {
                const item = current.item(i);
                if (item.name === segment) {
                    found = item;
                    break;
                }
            }

            if (!found) {
                return null; // Segment not found
            }

            // If it's the last segment, return it
            if (segment === segments[segments.length - 1]) {
                return found;
            }

            // Otherwise, it must be a folder to continue
            if (!(found instanceof FolderItem)) {
                return null; // Cannot navigate into non-folder
            }

            current = found;
        }

        return null; // Should not reach here
    }

    getParent(path: string): string {
        const segments = this.parse(path);
        if (segments.length <= 1) {
            return ""; // Root or empty
        }
        segments.pop();
        return this.separator + segments.join(this.separator);
    }

    getName(path: string): string {
        const segments = this.parse(path);
        return segments.length > 0 ? segments[segments.length - 1] : "";
    }

    isAbsolute(path: string): boolean {
        return path.indexOf(this.separator) === 0;
    }

    normalize(path: string): string {
        // Remove leading/trailing separators, collapse multiple separators
        let normalized = path.replace(
            new RegExp(this.separator + "+", "g"),
            this.separator
        );
        if (normalized.indexOf(this.separator) === 0) {
            normalized = normalized.slice(this.separator.length);
        }
        const sepLen = this.separator.length;
        if (
            normalized.lastIndexOf(this.separator) ===
            normalized.length - sepLen
        ) {
            normalized = normalized.slice(0, -sepLen);
        }
        return this.separator + normalized;
    }

    getRelative(fromPath: string, toPath: string): string {
        // Simple relative path calculation
        // For now, just return toPath if absolute, else join
        if (this.isAbsolute(toPath)) {
            return toPath;
        }
        // Assuming fromPath is absolute
        const fromSegments = this.parse(fromPath);
        const toSegments = this.parse(toPath);
        // For simplicity, just append to fromPath
        return fromPath + this.separator + toSegments.join(this.separator);
    }

    list(root: Project | FolderItem, prefix: string = ""): string[] {
        const paths: string[] = [];
        this.traverse(root, (item) => {
            const itemPath = this.get(item);
            paths.push(itemPath);
        });
        return paths;
    }

    getItem(path: string): _ItemClasses | null {
        return this.resolve(app.project.rootFolder, path);
    }
}

const KT_AeProjectPath = new __KT_AeProjectPath();
export { KT_AeProjectPath };
