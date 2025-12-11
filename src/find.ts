import { KT_StringUtils, KT_FilterChainFactory } from "kt-core";
import { KT_AeProjectPath as pPath } from "./path";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_LazyCache, KT_CacheStore } from "./lazyCache";

type FindProjectOptionParams = {
    name?: string | string[] | RegExp | RegExp[];
    path?: string | string[] | RegExp | RegExp[];
    relativePath?: string | string[] | RegExp | RegExp[];
    startsWith?: string | string[] | RegExp | RegExp[];
    endsWith?: string | string[] | RegExp | RegExp[];
    contains?: string | string[] | RegExp | RegExp[];
    id?: number | number[];
    caseSensitive?: boolean;
    deep?: boolean;
    root?: FolderItem;
    check?: (item: _ItemClasses) => boolean;
    callback?: (item: _ItemClasses) => void;
};

type FindProjectUniqueParam = string | string[] | number | number[] | RegExp | RegExp[];
type FindProjectParams = FindProjectOptionParams | FindProjectUniqueParam;

class __KT_ProjectFind {
    private filterFactory = new KT_FilterChainFactory({
        name: null,
        path: (item: _ItemClasses, expectedArray: any[]) => {
            const itemPath = pPath.get(item);
            for (let i = 0; i < expectedArray.length; i++) {
                if (itemPath === expectedArray[i]) return true;
            }
            return false;
        },
        relativePath: (item: _ItemClasses, expectedArray: any[]) => {
            const itemFullPath = pPath.get(item);
            const itemRelPath = pPath.getParentPath(itemFullPath);
            for (let i = 0; i < expectedArray.length; i++) {
                if (itemFullPath === expectedArray[i] || itemRelPath === expectedArray[i]) return true;
            }
            return false;
        },
        startsWith: null,
        endsWith: null,
        contains: null,
        id: (item: _ItemClasses, expectedArray: any[]) => {
            for (let i = 0; i < expectedArray.length; i++) {
                if (item.id == expectedArray[i]) return true;
            }
            return false;
        },
        check: (item: _ItemClasses, expectedArray: any[]) => {
            if (expectedArray.length > 0 && typeof expectedArray[0] === "function") {
                return expectedArray[0](item);
            }
            return false;
        },
        root: (item: _ItemClasses, expectedArray: any[]) => {
            if (expectedArray.length > 0 && is.folder(expectedArray[0])) {
                const rootFolder = expectedArray[0] as FolderItem;
                let parent = item.parentFolder;
                return parent === rootFolder;
            }
            return false;
        },
    });

    items = (options: FindProjectParams | number | string): _ItemClasses[] => {
        return this.__findItems(KT_LazyCache.allItems, options);
    };

    folders = (options: FindProjectParams | number | string): FolderItem[] => {
        return this.__findItems(KT_LazyCache.folders, options) as FolderItem[];
    };

    comps = (options: FindProjectParams | number | string): CompItem[] => {
        return this.__findItems(KT_LazyCache.comps, options) as CompItem[];
    };

    footage = (options: FindProjectParams | number | string): FootageItem[] => {
        return this.__findItems(KT_LazyCache.footage, options) as FootageItem[];
    };

    audios = (options: FindProjectParams | number | string): FootageItem[] => {
        return this.__findItems(KT_LazyCache.audio, options) as FootageItem[];
    };

    videos = (options: FindProjectParams | number | string): FootageItem[] => {
        return this.__findItems(KT_LazyCache.video, options) as FootageItem[];
    };

    images = (options: FindProjectParams | number | string): FootageItem[] => {
        return this.__findItems(KT_LazyCache.images, options) as FootageItem[];
    };

    solids = (options: FindProjectParams | number | string): FootageItem[] => {
        KT_LazyCache.scanSolids();
        return this.__findItems(KT_LazyCache.solids, options) as FootageItem[];
    };

    private __findItems = <T extends _ItemClasses>(cacheStore: KT_CacheStore<T>, options: FindProjectParams): T[] => {
        KT_LazyCache.init();

        if (!options) return [];

        let candidates: T[] = [];
        let usedOptimizedLookup = false;

        if (typeof options === "number") {
            const item = cacheStore.getById(options);
            if (item) candidates = [item];
            usedOptimizedLookup = true;
        } else if (typeof options === "string") {
            if (pPath.isPath(options)) {
                const item = cacheStore.getByPath(options);
                if (item) candidates = [item];
            } else {
                candidates = cacheStore.getByName(options);
            }
            usedOptimizedLookup = true;
        } else if (options instanceof RegExp) {
            candidates = cacheStore.getByRegExp(options);
            usedOptimizedLookup = true;
        } else if (typeof options === "object" && !Array.isArray(options)) {
            const opts = options as FindProjectOptionParams;
            const isCaseSensitive = opts.caseSensitive !== false;

            // Priority 1: ID
            if (typeof opts.id === "number") {
                const item = cacheStore.getById(opts.id);
                if (item) candidates = [item];
                usedOptimizedLookup = true;
            }
            // Priority 2: Path
            else if (typeof opts.path === "string") {
                const item = cacheStore.getByPath(opts.path);
                if (item) candidates = [item];
                usedOptimizedLookup = true;
            }
            // Priority 3: Name (String or RegExp)
            else if (typeof opts.name === "string") {
                if (isCaseSensitive) {
                    candidates = cacheStore.getByName(opts.name);
                } else {
                    // Optimized case-insensitive search: Convert to RegExp
                    const escaped = opts.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    const regex = new RegExp(`^${escaped}$`, "i");
                    candidates = cacheStore.getByRegExp(regex);
                }
                usedOptimizedLookup = true;
            } else if (opts.name instanceof RegExp) {
                candidates = cacheStore.getByRegExp(opts.name);
                usedOptimizedLookup = true;
            }
        }

        if (!usedOptimizedLookup) {
            candidates = cacheStore.getAll();
        }

        const sanitized = this.filterFactory.sanitize(options);
        const caseSensitive = (options as any).caseSensitive !== false;
        const filteredItems: T[] = [];

        for (const item of candidates) {
            if (this.filterFactory.filter(item, sanitized, caseSensitive)) {
                if ((options as any).callback) {
                    (options as any).callback(item);
                }
                filteredItems.push(item);
            }
        }

        return filteredItems;
    };
}

const KT_ProjectFind = new __KT_ProjectFind();
export { KT_ProjectFind };
