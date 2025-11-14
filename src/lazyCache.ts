import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_AeProjectPath as pPath } from "./path";
type KT_SubCache = {
    [key: string]: _ItemClasses[];
};

type KT_Cache = {
    id: KT_SubCache;
    name: KT_SubCache;
    path: KT_SubCache;
    folder: KT_SubCache;
    comp: KT_SubCache;
    footage: KT_SubCache;
    audio: KT_SubCache;
    video: KT_SubCache;
    image: KT_SubCache;
    solid: KT_SubCache;
};

class __KT_LazyCache {
    private cache: { [key: string]: KT_SubCache } | undefined = undefined;
    private cachesNames: string[] = [
        "id",
        "name",
        "path",
        "folder",
        "comp",
        "footage",
        "audio",
        "video",
        "image",
        "solid",
    ];
    debugCache: { [key: string]: KT_SubCache } | undefined = undefined;

    constructor() {
        this.init();
    }

    init = (debug: boolean = false): void => {
        this.debugCache = debug ? this.cache : undefined;
        if (this.cache === undefined) {
            this.cache = {};
            for (const cacheName of this.cachesNames) {
                this.cache[cacheName] = {};
            }
        }
    };

    reset = (): void => {
        this.clear();
        this.init();
    };

    refresh = (): void => {
        this.reset();
        this.scan();
    };

    clear = (): void => {
        if (this.cache === undefined) return;
        this.cache = undefined;
    };

    scan = (): void => {
        if (this.cache === undefined) {
            $.writeln("KT_Cache not initialized. Call init() first.");
            return;
        }
        const allItems = app.project.items;

        for (let i = 1; i <= allItems.length; i++) {
            const item = allItems[i];
            for (const cacheName of this.cachesNames) {
                this.add(item, cacheName, cacheName);
            }
        }
    };

    add = (item: _ItemClasses, cache: string, key: string): void => {
        if (!this.cache) {
            this.init();
        }
        if (cache === "path") {
            this.__addToPathCache(item);
        } else if (cache === "name" || cache === "id") {
            this.__addToNamedCahe(item, key);
        } else {
            this.__addToTypedCache(item, key);
        }
    };

    print = (): void => {
        if (!this.cache) {
            $.writeln("KT_Cache not initialized. Call init() first.");
            return;
        }
        for (const cacheName of this.cachesNames) {
            const cacheSection = this.cache[cacheName as keyof KT_Cache];
            $.writeln(`Cache: ${cacheName}`);
            for (const key in cacheSection) {
                const items = cacheSection[key];
                const itemIds = items.map((item) => item.id).join(", ");
                for (const item of items) {
                    $.writeln(`  Key: ${key} => Item ID: ${item.id}, Name: ${item.name}`);
                }
            }
        }
    };

    private __addToPathCache = (item: _ItemClasses): void => {
        if (!this.cache) return;
        const cacheSection = this.cache["path"];
        const itemPath = pPath.get(item);
        if (!itemPath) return;
        if (!cacheSection[itemPath]) {
            cacheSection[itemPath] = [item];
        } else {
            cacheSection[itemPath].push(item);
        }
    };

    private __addToNamedCahe = (item: _ItemClasses, key: string): void => {
        if (!this.cache) return;
        const itemKey = this.__getItemKey(item, key);
        if (!itemKey) return;
        const cacheSection = this.cache[key as keyof KT_Cache];
        if (!cacheSection[itemKey]) {
            cacheSection[itemKey] = [item];
        } else {
            cacheSection[itemKey].push(item);
        }
    };

    private __addToTypedCache = (item: _ItemClasses, key: string): void => {
        if (!this.cache) return;
        const cacheSection = this.cache[key as keyof KT_Cache];
        if (typeof is[key as keyof typeof is] === "function") {
            const keyResult = is[key as keyof typeof is](item);
            if (keyResult) {
                if (!cacheSection[item.id.toString()]) {
                    cacheSection[item.id.toString()] = [item];
                } else {
                    cacheSection[item.id.toString()].push(item);
                }
                return;
            }
        }
    };

    private __getItemKey = (item: _ItemClasses, key: string): string | null => {
        if (!(item as any)[key]) return null;
        return (item as any)[key].toString();
    };
}

const KT_LazyCache = new __KT_LazyCache();
export { KT_LazyCache };
