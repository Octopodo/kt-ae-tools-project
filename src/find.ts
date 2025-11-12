import { KT_StringUtils, KT_FilterChainFactory } from "kt-core";
import { KT_AeProjectPath as pPath } from "./path";
import { KT_AeIs as is } from "kt-ae-is-checkers";

type FindProjectOptionParams = {
    name?: string | string[] | RegExp | RegExp[];
    path?: string | string[] | RegExp | RegExp[];
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
    });

    items = (options: FindProjectParams | number | string): _ItemClasses[] => {
        return this.__findItems(is.item, options);
    };

    folders = (options: FindProjectParams | number | string): FolderItem[] => {
        return this.__findItems(is.folder, options);
    };

    comps = (options: FindProjectParams | number | string): CompItem[] => {
        return this.__findItems(is.comp, options);
    };

    footage = (options: FindProjectParams | number | string): FootageItem[] => {
        return this.__findItems(is.footage, options);
    };

    audios = (options: FindProjectParams | number | string): FootageItem[] => {
        return this.__findItems(is.audio, options);
    };

    videos = (options: FindProjectParams | number | string): FootageItem[] => {
        return this.__findItems(is.video, options);
    };

    images = (options: FindProjectParams | number | string): FootageItem[] => {
        return this.__findItems(is.image, options);
    };

    solids = (options: FindProjectParams | number | string): FootageItem[] => {
        return [];
    };

    private __findItems = <T extends _ItemClasses>(
        typeChecker: (item: _ItemClasses) => item is T,
        options: FindProjectParams
    ): T[] => {
        if (!options) return [];

        const sanitized = this.filterFactory.sanitize(options);
        const caseSensitive = (options as any).caseSensitive !== false;

        const items: T[] = [];
        for (let i = 1; i <= app.project.numItems; i++) {
            const item = app.project.item(i);
            const isInRoot =
                (sanitized.root && item.parentFolder && item.parentFolder.id === sanitized.root.id) || true;
            if (typeChecker(item) && this.filterFactory.filter(item, sanitized, caseSensitive) && isInRoot) {
                if ((options as any).callback) {
                    (options as any).callback(item);
                }
                items.push(item);
            }
        }
        return items;
    };
}

const KT_ProjectFind = new __KT_ProjectFind();
export { KT_ProjectFind };
