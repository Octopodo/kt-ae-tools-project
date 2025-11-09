import { KT_StringUtils } from "kt-core";
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
};

type FindProjectUniqueParam = string | string[] | number | number[] | RegExp | RegExp[];
type FindProjectParams = FindProjectOptionParams | FindProjectUniqueParam;
type FindProjectSingleOption = (string | number | RegExp)[];
type FindProjectOptions = {
    name: (string | RegExp)[];
    path: string[];
    startsWith: (string | RegExp)[];
    endsWith: (string | RegExp)[];
    contains: (string | RegExp)[];
    id: number[];
    caseSensitive: boolean;
    deep: boolean;
    root: FolderItem;
};

class KT_ProjectFind {
    static items = (options: FindProjectParams | number | string): _ItemClasses[] => {
        return KT_ProjectFind._findItems(is.item, options);
    };

    static folders = (options: FindProjectParams | number | string): FolderItem[] => {
        return KT_ProjectFind._findItems(is.folder, options);
    };

    static comps = (options: FindProjectParams | number | string): CompItem[] => {
        return KT_ProjectFind._findItems(is.comp, options);
    };

    static footage = (options: FindProjectParams | number | string): FootageItem[] => {
        return KT_ProjectFind._findItems(is.footage, options);
    };

    static audios = (options: FindProjectParams | number | string): FootageItem[] => {
        return KT_ProjectFind._findItems(is.audio, options);
    };

    static videos = (options: FindProjectParams | number | string): FootageItem[] => {
        return KT_ProjectFind._findItems(is.video, options);
    };

    static images = (options: FindProjectParams | number | string): FootageItem[] => {
        return KT_ProjectFind._findItems(is.image, options);
    };

    static solids = (options: FindProjectParams | number | string): FootageItem[] => {
        return [];
    };

    private static _findItems = <T extends _ItemClasses>(
        typeChecker: (item: _ItemClasses) => item is T,
        options: FindProjectParams
    ): T[] => {
        let normalizedOptions = KT_ProjectFind._filterParams(options);
        const items: T[] = [];
        for (let i = 1; i <= app.project.numItems; i++) {
            const item = app.project.item(i);
            if (
                typeChecker(item) &&
                KT_ProjectFind._matchItem(
                    item,
                    normalizedOptions.name,
                    normalizedOptions.caseSensitive,
                    KT_ProjectFind._matchName
                ) &&
                KT_ProjectFind._matchItem(
                    item,
                    normalizedOptions.id,
                    normalizedOptions.caseSensitive,
                    KT_ProjectFind._matchId
                ) &&
                KT_ProjectFind._matchItem(
                    item,
                    normalizedOptions.path,
                    normalizedOptions.caseSensitive,
                    KT_ProjectFind._matchPath
                ) &&
                KT_ProjectFind._matchItem(
                    item,
                    normalizedOptions.startsWith,
                    normalizedOptions.caseSensitive,
                    KT_ProjectFind._matchStartsWith
                ) &&
                KT_ProjectFind._matchItem(
                    item,
                    normalizedOptions.endsWith,
                    normalizedOptions.caseSensitive,
                    KT_ProjectFind._matchEndsWith
                ) &&
                KT_ProjectFind._matchItem(
                    item,
                    normalizedOptions.contains,
                    normalizedOptions.caseSensitive,
                    KT_ProjectFind._matchContains
                )
            ) {
                items.push(item);
            }
        }
        return items;
    };

    private static _matchName = (
        item: _ItemClasses,
        target: FindProjectUniqueParam,
        caseSensitive: boolean
    ): boolean => {
        if (typeof target === "string" || target instanceof RegExp) {
            return KT_StringUtils.equals(item.name, target, caseSensitive);
        }
        return false;
    };

    private static _matchPath = (
        item: _ItemClasses,
        target: FindProjectUniqueParam,
        caseSensitive: boolean
    ): boolean => {
        if (typeof target === "string" && pPath.isPath(target)) {
            const path = pPath.get(item);
            return path === target;
        }
        return false;
    };

    private static _matchId = (item: _ItemClasses, target: FindProjectUniqueParam, caseSensitive: boolean): boolean => {
        if (typeof target === "number") {
            return item.id === target;
        }
        return false;
    };

    private static _matchStartsWith = (
        item: _ItemClasses,
        target: FindProjectUniqueParam,
        caseSensitive: boolean
    ): boolean => {
        if (typeof target === "string" || target instanceof RegExp) {
            return KT_StringUtils.startsWith(item.name, target, caseSensitive);
        }

        return false;
    };

    private static _matchEndsWith = (
        item: _ItemClasses,
        target: FindProjectUniqueParam,
        caseSensitive: boolean
    ): boolean => {
        if (typeof target === "string" || target instanceof RegExp) {
            return KT_StringUtils.endsWith(item.name, target, caseSensitive);
        }
        return false;
    };

    private static _matchContains = (
        item: _ItemClasses,
        target: FindProjectUniqueParam,
        caseSensitive: boolean
    ): boolean => {
        if (typeof target === "string" || target instanceof RegExp) {
            return KT_StringUtils.contains(item.name, target, caseSensitive);
        }
        return false;
    };

    private static _matchItem = (
        item: _ItemClasses,
        options: FindProjectSingleOption,
        caseSensitive: boolean,
        checker: (item: _ItemClasses, option: FindProjectUniqueParam, caseSensitive: boolean) => boolean
    ): boolean => {
        let match = options.length < 1 || false;
        for (const option of options) {
            if (checker(item, option, caseSensitive)) {
                match = true;
                break;
            }
        }
        return match;
    };
    // Normalize params to an options object
    // Normalize params to an options object
    // Normalize params to an options object
    private static _filterParams = (params: FindProjectParams): FindProjectOptions => {
        const options: FindProjectOptions = {
            name: [],
            path: [],
            startsWith: [],
            endsWith: [],
            contains: [],
            id: [],
            caseSensitive: true,
            deep: false,
            root: app.project.rootFolder,
        };
        let simpleParam: (string | number | RegExp | undefined)[] = [];

        if (
            typeof params === "string" ||
            params instanceof RegExp ||
            typeof params === "number" ||
            params instanceof Array
        ) {
            if (typeof params === "number") {
                filterSingleParam(params, "id");
                return options;
            } else if (typeof params === "string" && pPath.isPath(params as string)) {
                filterSingleParam(params, "path");
                return options;
            } else {
                filterSingleParam(params, "name");
                return options;
            }
        }
        // It's an object with options
        if (typeof params === "object" && params !== null) {
            for (const key in params) {
                let keyStr = key as string; // Aserto string (for...in keys son strings)
                if (keyStr === "caseSensitive" || keyStr === "deep" || keyStr === "root") {
                    (options as any)[keyStr] = (params as any)[keyStr];
                } else if (
                    keyStr === "name" ||
                    keyStr === "path" ||
                    keyStr === "startsWith" ||
                    keyStr === "endsWith" ||
                    keyStr === "contains"
                ) {
                    // Keys válidas para buckets
                    filterSingleParam((params as any)[keyStr], keyStr);
                } else if (keyStr === "id") {
                    // Manejo especial para id
                    filterSingleParam((params as any)[keyStr], undefined);
                } else {
                    // Ignora keys inválidas
                    continue;
                }
            }
        }

        function filterSingleParam(param: FindProjectUniqueParam, bucketKey?: string): void {
            let currentParam = param;
            if (bucketKey && bucketKey !== "name" && bucketKey !== "path") {
                // For secondary buckets, push directly after toArray
                let paramArray = currentParam instanceof Array ? currentParam : [currentParam];
                for (const p of paramArray) {
                    if (typeof p === "string" || p instanceof RegExp) {
                        (options as any)[bucketKey].push(p);
                    } else if (typeof p === "number") {
                        options.id!.push(p);
                    }
                }
                return;
            }
            // Fallback for simples/exact/id
            if (currentParam instanceof Array) {
                simpleParam = currentParam;
            } else {
                simpleParam = [currentParam];
            }

            for (const paramItem of simpleParam) {
                if (typeof paramItem === "string") {
                    if (pPath.isPath(paramItem)) {
                        options.path!.push(paramItem);
                    } else {
                        options.name!.push(paramItem);
                    }
                } else if (typeof paramItem === "number") {
                    options.id!.push(paramItem);
                } else if (paramItem instanceof RegExp) {
                    options.name!.push(paramItem); // Treat as string pattern for name
                }
            }
        }
        return options;
    };

    // Find path
    private static _findPath(root: FolderItem, options: FindProjectOptions): string | undefined {
        // Implementación de búsqueda de ruta
        return;
    }

    private static getRoot(options: FindProjectOptions): FolderItem {
        return options.root || app.project.rootFolder;
    }
}

export { KT_ProjectFind };
