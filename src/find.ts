import { KT_AeProjectPath as pPath } from "./path";
import { KT_AeIs as is } from "kt-ae-is-checkers";

type FindProjectOptions = {
    name?: string;
    id?: number;
    path?: string;
    root?: FolderItem;
};

function getRoot(options: FindProjectOptions): FolderItem {
    return options.root || app.project.rootFolder;
}

class KT_ProjectFind {
    private static isInSubtree = (item: _ItemClasses, root: FolderItem): boolean => {
        let current: FolderItem | Project = item.parentFolder;
        while (current) {
            if (current === root) return true;
            if (current instanceof Project) break;
            current = current.parentFolder;
        }
        return false;
    };

    private static _normalizeOptions = (options: FindProjectOptions | number | string): FindProjectOptions => {
        const normalized: FindProjectOptions = {};
        if (typeof options === "number") {
            normalized.id = options;
        } else if (typeof options === "string") {
            if (pPath.isPath(options)) {
                normalized.path = options;
            } else {
                normalized.name = options;
            }
        } else {
            normalized.name = options.name;
            normalized.id = options.id;
            normalized.path = options.path;
            normalized.root = options.root;
        }
        return normalized;
    };

    // Nuevo: Traversión recursiva desde root para búsquedas scoped
    private static _traverseFromRoot<T extends _ItemClasses>(
        root: FolderItem,
        typeChecker: (item: _ItemClasses) => item is T,
        options: FindProjectOptions
    ): T[] {
        const items: T[] = [];
        const numItems = root.numItems;
        for (let i = 1; i <= numItems; i++) {
            const item = root.item(i);
            if (
                typeChecker(item) &&
                (!options.name || item.name === options.name) &&
                (!options.path || pPath.get(item) === options.path)
            ) {
                items.push(item);
            }
            if (item instanceof FolderItem) {
                // Recursión en subfolders
                items.push(...this._traverseFromRoot(item, typeChecker, options));
            }
        }
        return items;
    }

    private static _findItems = <T extends _ItemClasses>(
        typeChecker: (item: _ItemClasses) => item is T,
        options: FindProjectOptions | number | string
    ): T[] => {
        options = this._normalizeOptions(options);
        const root = getRoot(options);
        const isGlobalRoot = root === app.project.rootFolder;

        if (options.id) {
            try {
                const item = app.project.itemByID(options.id);
                if (
                    item &&
                    this.isInSubtree(item, root) && // Necesario para ID en sub-root
                    typeChecker(item) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path || pPath.get(item) === options.path)
                ) {
                    return [item];
                }
            } catch (e) {}
            return [];
        } else if (!isGlobalRoot) {
            // Optimización: Traversión solo desde root custom
            return this._traverseFromRoot(root, typeChecker, options);
        } else {
            // Fallback: Scan global
            const items: T[] = [];
            for (let i = 1; i <= app.project.numItems; i++) {
                const item = app.project.item(i);
                if (
                    typeChecker(item) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path || pPath.get(item) === options.path)
                ) {
                    items.push(item);
                }
            }
            return items;
        }
    };

    static items = (options: FindProjectOptions | number | string): _ItemClasses[] => {
        return KT_ProjectFind._findItems(is.item, options);
    };

    static folders = (options: FindProjectOptions | number | string): FolderItem[] => {
        return KT_ProjectFind._findItems(is.folder, options);
    };

    static comps = (options: FindProjectOptions | number | string): CompItem[] => {
        return KT_ProjectFind._findItems(is.comp, options);
    };

    static footage = (options: FindProjectOptions | number | string): FootageItem[] => {
        return KT_ProjectFind._findItems(is.footage, options);
    };

    static audios = (options: FindProjectOptions | number | string): FootageItem[] => {
        return KT_ProjectFind._findItems(is.audio, options);
    };

    static videos = (options: FindProjectOptions | number | string): FootageItem[] => {
        return KT_ProjectFind._findItems(is.video, options);
    };

    static images = (options: FindProjectOptions | number | string): FootageItem[] => {
        return KT_ProjectFind._findItems(is.image, options);
    };

    static solids = (options: FindProjectOptions | number | string): FootageItem[] => {
        // Note: Solids are FootageItem
        options = KT_ProjectFind._normalizeOptions(options); // Normalize early
        const root = getRoot(options);

        // Step 1: Search for "Solids" folder within the root
        const solidsFolders = KT_ProjectFind._findItems(is.folder, { name: "Solids", root }) as FolderItem[];
        if (solidsFolders.length > 0) {
            const solidsFolder = solidsFolders[0]; // Assumes only one Solids folder

            // Step 2: Search for solids inside the Solids folder

            const solidsInFolder = KT_ProjectFind._findItems(is.solid, { ...options, root: solidsFolder });
            if (solidsInFolder.length > 0) {
                return solidsInFolder; // Success: Return only these
            }
        }

        // Step 3: Fallback to search in the entire root
        return KT_ProjectFind._findItems(is.solid, options);
    };
}

export { KT_ProjectFind };
