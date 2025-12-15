import { KT_IPathAdapter, KT_LazyCache, KT_CacheStore } from "kt-core";
import { KT_AeProjectPath } from "./path";
import { KT_AeIs as is } from "kt-ae-is-checkers";

const aeCheckers = {
    all: is.item,
    comps: is.comp,
    folders: is.folder,
    footage: is.footage,
    solids: is.solid,
    images: is.image,
    audio: is.audio,
    video: is.video,
};
export class KT_AeLazyCache extends KT_LazyCache<_ItemClasses> {
    constructor() {
        super(
            KT_AeProjectPath,
            aeCheckers,
            // Root getter
            () => app.project.rootFolder,
            // Count getter (for invalidation)
            () => app.project.numItems
        );
    }

    all(): KT_CacheStore<_ItemClasses> {
        return this.get("all") as KT_CacheStore<_ItemClasses>;
    }
    /**
     * Type-safe accessor for Comps sub-cache
     */
    comps(): KT_CacheStore<CompItem> {
        return this.get("comps") as KT_CacheStore<CompItem>;
    }

    /**
     * Type-safe accessor for Folders sub-cache
     */
    folders(): KT_CacheStore<FolderItem> {
        return this.get("folders") as KT_CacheStore<FolderItem>;
    }

    footage(): KT_CacheStore<FootageItem> {
        return this.get("footage") as KT_CacheStore<FootageItem>;
    }

    solids(): KT_CacheStore<FootageItem> {
        return this.get("solids") as KT_CacheStore<FootageItem>;
    }
    images(): KT_CacheStore<FootageItem> {
        return this.get("images") as KT_CacheStore<FootageItem>;
    }
    audio(): KT_CacheStore<FootageItem> {
        return this.get("audio") as KT_CacheStore<FootageItem>;
    }
    video(): KT_CacheStore<FootageItem> {
        return this.get("video") as KT_CacheStore<FootageItem>;
    }

    // ... expose others as needed
}
// ------------------------------------------------------------------
// 5. EXPORT SINGLETON
// ------------------------------------------------------------------
export const KT_AeCache = new KT_AeLazyCache();
