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
    private static isInSubtree(item: _ItemClasses, root: FolderItem): boolean {
        let current: FolderItem | Project = item.parentFolder;
        while (current) {
            if (current === root) return true;
            if (current instanceof Project) break;
            current = current.parentFolder;
        }
        return false;
    }

    private static _normalizeOptions(options: FindProjectOptions | number | string): FindProjectOptions {
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
    }

    private static _findItems<T extends _ItemClasses>(
        typeChecker: (item: _ItemClasses) => item is T,
        options: FindProjectOptions | number | string
    ): T[] {
        options = this._normalizeOptions(options);
        const root = getRoot(options);
        const items: T[] = [];
        if (options.id) {
            try {
                const item = app.project.itemByID(options.id);
                if (
                    item &&
                    KT_ProjectFind.isInSubtree(item, root) &&
                    typeChecker(item) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path || pPath.get(item) === options.path)
                ) {
                    items.push(item);
                }
            } catch (e) {}
        } else {
            for (let i = 1; i <= app.project.numItems; i++) {
                const item = app.project.item(i);
                if (
                    KT_ProjectFind.isInSubtree(item, root) &&
                    typeChecker(item) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path || pPath.get(item) === options.path)
                ) {
                    items.push(item);
                }
            }
        }
        return items;
    }

    static items(options: FindProjectOptions | number | string): _ItemClasses[] | false {
        const items = KT_ProjectFind._findItems(is.item, options);
        return items.length > 0 ? items : false;
    }

    static folders(options: FindProjectOptions | number | string): FolderItem[] | false {
        const items = KT_ProjectFind._findItems(is.folder, options);
        const folders = items as FolderItem[];
        if (folders.length === 0) return false;
        return folders;
    }

    static comps(options: FindProjectOptions | number | string): CompItem[] | false {
        const items = KT_ProjectFind._findItems(is.comp, options);
        const comps = items as CompItem[];
        return comps.length > 0 ? comps : false;
    }

    static footage(options: FindProjectOptions | number | string): FootageItem[] | false {
        const items = KT_ProjectFind._findItems(is.footage, options);
        const footage = items as FootageItem[];
        return footage.length > 0 ? footage : false;
    }

    static audios(options: FindProjectOptions | number | string): FootageItem[] | false {
        const items = KT_ProjectFind._findItems(is.audio, options);
        const audio = items as FootageItem[];
        return audio.length > 0 ? audio : false;
    }

    static videos(options: FindProjectOptions | number | string): FootageItem[] | false {
        const items = KT_ProjectFind._findItems(is.video, options);
        const video = items as FootageItem[];
        return video.length > 0 ? video : false;
    }

    static images(options: FindProjectOptions | number | string): FootageItem[] | false {
        const items = KT_ProjectFind._findItems(is.image, options);
        const images = items as FootageItem[];
        return images.length > 0 ? images : false;
    }

    static solids(options: FindProjectOptions | number | string): _ItemClasses[] | false {
        const items = KT_ProjectFind._findItems(is.solid, options);
        return items.length > 0 ? items : false;
    }
}

export { KT_ProjectFind };
