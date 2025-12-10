import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_AeProjectPath } from "./path";

/**
 * Generic Cache Store that maintains indices for ID, Name, and Path.
 */
export class KT_CacheStore<T extends _ItemClasses> {
    private _byId: { [key: string]: T } = {};
    private _byName: { [key: string]: T[] } = {};
    private _byPath: { [key: string]: T } = {};
    private _pathsById: { [key: string]: string } = {}; // Inverse index for O(1) path retrieval
    private _items: T[] = [];

    // Optimization for RegExp search
    private _allNamesString: string = "";
    private static readonly SEPARATOR = "\n"; // Use newline for multiline regex support

    constructor() {}

    /**
     * Adds an item to the cache.
     * @param item The item to add.
     * @param knownPath Optional pre-calculated path. If omitted, it will be calculated.
     */
    add(item: T, knownPath?: string) {
        // Use known path if provided (scan optimization), else calculate it
        const path = knownPath || KT_AeProjectPath.get(item);

        //Check if item already exists
        if (this._byId[item.id.toString()]) {
            return;
        }

        this._items.push(item);

        // ID Index
        this._byId[item.id.toString()] = item;

        // Name Index
        if (!this._byName[item.name]) {
            this._byName[item.name] = [];
            // Sanitize name to remove newlines if any, to preserve integrity
            const safeName = item.name.replace(/\n/g, "");
            // Only append to string if it's a new name
            this._allNamesString += KT_CacheStore.SEPARATOR + safeName + KT_CacheStore.SEPARATOR;
        }
        this._byName[item.name].push(item);

        // Path Index
        this._byPath[path] = item;
        this._pathsById[item.id.toString()] = path;
    }

    remove(item: T) {
        // Remove from items array
        for (let i = 0; i < this._items.length; i++) {
            if (this._items[i].id === item.id) {
                this._items.splice(i, 1);
                break;
            }
        }

        // Remove from ID Index
        delete this._byId[item.id.toString()];

        // Remove from Path Index
        // Use our internal index for O(1) access
        const path = this._pathsById[item.id.toString()] || KT_AeProjectPath.get(item);
        if (this._byPath[path] && this._byPath[path].id === item.id) {
            delete this._byPath[path];
        }
        delete this._pathsById[item.id.toString()];

        // Remove from Name Index
        if (this._byName[item.name]) {
            const arr = this._byName[item.name];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id === item.id) {
                    arr.splice(i, 1);
                    break;
                }
            }
            // Logic to clean up _allNamesString if name is no longer used
            if (arr.length === 0) {
                delete this._byName[item.name];
                const safeName = item.name.replace(/\n/g, "");
                const strToRemove = KT_CacheStore.SEPARATOR + safeName + KT_CacheStore.SEPARATOR;
                // We use split/join to remove all occurrences
                this._allNamesString = this._allNamesString.split(strToRemove).join("");
            }
        }
    }

    /**
     * Updates an item in the cache.
     * Handles path changes efficiently using the internal index.
     */
    update(item: T, newPath?: string) {
        const idStr = item.id.toString();
        const oldPath = this._pathsById[idStr];
        const path = newPath || KT_AeProjectPath.get(item);

        if (oldPath !== path) {
            if (oldPath && this._byPath[oldPath]) delete this._byPath[oldPath];
            this._byPath[path] = item;
            this._pathsById[idStr] = path;
        }
    }

    /**
     * Efficiently updates paths for items starting with a specific prefix.
     * Used for cascading folder moves.
     */
    renamePathPrefix(oldPrefix: string, newPrefix: string) {
        for (const path in this._byPath) {
            if (this._byPath.hasOwnProperty(path)) {
                if (path.indexOf(oldPrefix) === 0) {
                    const item = this._byPath[path];
                    const suffix = path.substring(oldPrefix.length);
                    const newPath = newPrefix + suffix;

                    delete this._byPath[path];
                    this._byPath[newPath] = item;
                    this._pathsById[item.id.toString()] = newPath;
                }
            }
        }
    }

    getPathById(id: number): string | undefined {
        return this._pathsById[id.toString()];
    }

    clear() {
        this._byId = {};
        this._byName = {};
        this._byPath = {};
        this._pathsById = {};
        this._items = [];
        this._allNamesString = "";
    }

    getById(id: number): T | undefined {
        return this._byId[id.toString()];
    }

    getByName(name: string): T[] {
        return this._byName[name] || [];
    }

    getByPath(path: string): T | undefined {
        return this._byPath[path];
    }

    getByRegExp(regex: RegExp): T[] {
        const matches: T[] = [];
        // ExtendScript doesn't support Set, use object for uniqueness
        const uniqueNames: { [key: string]: boolean } = {};

        // ExtendScript RegExp doesn't have .flags property
        // We force 'g' (global) for iteration and 'm' (multiline) so ^$ work per line
        // . won't match \n, preventing catastrophic backtracking across names
        let flags = "gm";
        // We force 'i' (case-insensitive) for matching
        // @ts-ignore
        if (regex.ignoreCase) flags += "i";

        // @ts-ignore
        const globalRegex = new RegExp(regex.source, flags);

        // If the regex matches empty string, we need to prevent infinite loop manually if engine doesn't handle it
        // But with 'match' logic we rely on valid matches.

        let match;
        // Limit iterations to prevent infinite loops in case of weird regex behavior in ES3
        let safetyCounter = 0;
        const maxIterations = 100000;

        while ((match = globalRegex.exec(this._allNamesString)) !== null) {
            if (safetyCounter++ > maxIterations) break; // Emergency break

            // Ensure we advance if match is empty (though should not happen with useful regexes)
            // @ts-ignore
            if (match.index === globalRegex.lastIndex) {
                // @ts-ignore
                globalRegex.lastIndex++;
            }

            const matchIndex = match.index;

            // Find start separator (search backwards from matchIndex)
            const startSepIndex = this._allNamesString.lastIndexOf(KT_CacheStore.SEPARATOR, matchIndex);

            // Find end separator (search forwards from matchIndex)
            // Note: We search from matchIndex to ensure we find the newline AFTER the match start
            // If match contains newline (unlikely with .), we still want the binding newlines
            const endSepIndex = this._allNamesString.indexOf(KT_CacheStore.SEPARATOR, matchIndex);

            if (startSepIndex !== -1 && endSepIndex !== -1) {
                // Extract name (excluding separators)
                const name = this._allNamesString.substring(startSepIndex + 1, endSepIndex);

                // Double check if name is valid and not empty (e.g. if we matched between double separators)
                if (name && !uniqueNames[name]) {
                    uniqueNames[name] = true;
                    const items = this.getByName(name);
                    for (let i = 0; i < items.length; i++) {
                        matches.push(items[i]);
                    }
                }
            }
        }

        return matches;
    }

    getAll(): T[] {
        return this._items;
    }
}

class __KT_LazyCache {
    // Global Cache
    readonly allItems = new KT_CacheStore<_ItemClasses>();

    // Sub-Caches
    readonly comps = new KT_CacheStore<CompItem>();
    readonly folders = new KT_CacheStore<FolderItem>();
    readonly footage = new KT_CacheStore<FootageItem>();
    readonly images = new KT_CacheStore<FootageItem>();
    readonly audio = new KT_CacheStore<FootageItem>();
    readonly video = new KT_CacheStore<FootageItem>();
    readonly solids = new KT_CacheStore<FootageItem>();

    private _initialized: boolean = false;
    private _projectItemCount: number = 0;
    private _solidsScanned: boolean = false;

    constructor() {}

    init = (force: boolean = false): void => {
        if (!this._initialized || force || app.project.numItems !== this._projectItemCount) {
            this.scan();
        }
    };

    /**
     * Adds an item to the cache externally.
     * Useful when creating new items without rescanning.
     */
    add = (item: _ItemClasses): void => {
        if (!this._initialized) {
            this.scan();
            return;
        }

        // We delegate path calculation to the CacheStore entirely
        // KT_CacheStore.add will call KT_AeProjectPath.get(item) since we pass no 2nd arg

        // Add to global cache
        this.allItems.add(item);

        // Add to specific cache
        if (is.comp(item)) this.comps.add(item as CompItem);
        if (is.folder(item)) this.folders.add(item as FolderItem);
        if (is.footage(item)) {
            this.footage.add(item as FootageItem);

            if (is.solid(item)) this.solids.add(item as FootageItem);
            if (is.audio(item)) this.audio.add(item as FootageItem);
            if (is.video(item)) this.video.add(item as FootageItem);
            if (is.image(item)) this.images.add(item as FootageItem);
        }
    };

    /**
     * Removes an item from the cache externally.
     */
    remove = (item: _ItemClasses): void => {
        if (!this._initialized) return;

        // Remove from global cache
        this.allItems.remove(item);

        // Remove from specific cache
        if (is.comp(item)) this.comps.remove(item as CompItem);
        if (is.folder(item)) this.folders.remove(item as FolderItem);
        if (is.footage(item)) {
            this.footage.remove(item as FootageItem);

            if (is.solid(item)) this.solids.remove(item as FootageItem);
            if (is.audio(item)) this.audio.remove(item as FootageItem);
            if (is.video(item)) this.video.remove(item as FootageItem);
            if (is.image(item)) this.images.remove(item as FootageItem);
        }
    };

    /**
     * Updates an item in the cache.
     * Efficiently handles path changes, including cascading updates for folders.
     */
    update = (items: _ItemClasses[] | _ItemClasses): void => {
        if (!this._initialized) return;

        if (!Array.isArray(items)) items = [items];
        for (const item of items) {
            this.singleUpdate(item);
        }
    };
    /**
     * Updates an item in the cache.
     * Efficiently handles path changes, including cascading updates for folders.
     */
    singleUpdate = (item: _ItemClasses): void => {
        if (!this._initialized) return;

        const newPath = KT_AeProjectPath.get(item);
        const oldPath = this.allItems.getPathById(item.id);

        // Perform updates only if we have a valid path change
        // OR if needed for other properties (like name in the future, although name change implies path change usually)
        if (oldPath && newPath && oldPath !== newPath) {
            this.allItems.update(item, newPath);

            // Sub-cache updates
            if (is.comp(item)) this.comps.update(item as CompItem, newPath);
            if (is.folder(item)) {
                this.folders.update(item as FolderItem, newPath);

                // FOLDER MOVE CASCADE
                // If a folder moved, all its descendants need their paths updated in the cache
                const separator = KT_AeProjectPath.getSeparator();
                const oldPrefix = oldPath + separator;
                const newPrefix = newPath + separator;

                // Update all stores
                this.allItems.renamePathPrefix(oldPrefix, newPrefix);
                this.comps.renamePathPrefix(oldPrefix, newPrefix);
                this.folders.renamePathPrefix(oldPrefix, newPrefix);
                this.footage.renamePathPrefix(oldPrefix, newPrefix);
                this.images.renamePathPrefix(oldPrefix, newPrefix);
                this.audio.renamePathPrefix(oldPrefix, newPrefix);
                this.video.renamePathPrefix(oldPrefix, newPrefix);
                this.solids.renamePathPrefix(oldPrefix, newPrefix);
            }
            if (is.footage(item)) {
                this.footage.update(item as FootageItem, newPath);
                if (is.solid(item)) this.solids.update(item as FootageItem, newPath);
                if (is.audio(item)) this.audio.update(item as FootageItem, newPath);
                if (is.video(item)) this.video.update(item as FootageItem, newPath);
                if (is.image(item)) this.images.update(item as FootageItem, newPath);
            }
        }
    };

    clear = (): void => {
        this.allItems.clear();
        this.comps.clear();
        this.folders.clear();
        this.footage.clear();
        this.images.clear();
        this.audio.clear();
        this.video.clear();
        this.solids.clear();
        this._initialized = false;
        this._solidsScanned = false;
        this._projectItemCount = 0;
    };

    refresh = (): void => {
        this.scan();
    };

    scan = (): void => {
        this.clear();
        const root = app.project.rootFolder;
        this._scanRecursive(root, "");
        this._initialized = true;
        this._projectItemCount = app.project.numItems;
    };

    scanSolids = (): void => {
        if (this._solidsScanned) return;

        const root = app.project.rootFolder;
        let solidsFolder: FolderItem | null = null;

        for (let i = 1; i <= root.numItems; i++) {
            const item = root.item(i);
            if (is.folder(item) && item.name === "Solids") {
                solidsFolder = item as FolderItem;
                break;
            }
        }

        if (solidsFolder) {
            const separator = KT_AeProjectPath.getSeparator();
            this._scanRecursive(solidsFolder, separator + "Solids", true);
        }

        this._solidsScanned = true;
    };

    private _scanRecursive = (folder: FolderItem, parentPath: string, isSolidsScan: boolean = false): void => {
        const separator = KT_AeProjectPath.getSeparator();

        for (let i = 1; i <= folder.numItems; i++) {
            const item = folder.item(i);

            if (!isSolidsScan && folder === app.project.rootFolder && is.folder(item) && item.name === "Solids") {
                continue;
            }

            const currentPath = parentPath ? `${parentPath}${separator}${item.name}` : `${separator}${item.name}`;

            if (isSolidsScan) {
                if (is.solid(item)) this.solids.add(item as FootageItem, currentPath);
            } else {
                this.allItems.add(item, currentPath);

                if (is.comp(item)) this.comps.add(item as CompItem, currentPath);
                if (is.folder(item)) this.folders.add(item as FolderItem, currentPath);

                if (is.footage(item)) {
                    this.footage.add(item as FootageItem, currentPath);

                    if (is.solid(item)) this.solids.add(item as FootageItem, currentPath);
                    if (is.audio(item)) this.audio.add(item as FootageItem, currentPath);
                    if (is.video(item)) this.video.add(item as FootageItem, currentPath);
                    if (is.image(item)) this.images.add(item as FootageItem, currentPath);
                }
            }

            if (is.folder(item)) {
                this._scanRecursive(item as FolderItem, currentPath, isSolidsScan);
            }
        }
    };

    // --- Legacy/Convenience Accessors (Routing to Global Cache) ---

    getById = (id: number): _ItemClasses | undefined => {
        this.init();
        return this.allItems.getById(id);
    };

    getByName = (name: string): _ItemClasses[] => {
        this.init();
        return this.allItems.getByName(name);
    };

    getByPath = (path: string): _ItemClasses | undefined => {
        this.init();
        return this.allItems.getByPath(path);
    };
}

const KT_LazyCache = new __KT_LazyCache();
export { KT_LazyCache };
