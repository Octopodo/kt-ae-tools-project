import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_ProjectAdd as add } from "./add";
import { KT_ProjectMove as move } from "./move";
import { KT_AeProjectPath as path } from "./path";
import { KT_ProjectFind as find } from "./find";

type DuplicateParams = _ItemClasses | _ItemClasses[] | string | string[];

class KT_ProjectDuplicate {
    static comps = (items: DuplicateParams): CompItem[] => {
        return KT_ProjectDuplicate.__duplicateItems(items, "comp") as CompItem[];
    };

    static folders = (items: DuplicateParams): FolderItem[] => {
        return KT_ProjectDuplicate.__duplicateItems(items, "folder") as FolderItem[];
    };

    static footage = (items: DuplicateParams): FootageItem[] => {
        return KT_ProjectDuplicate.__duplicateItems(items, "footage") as FootageItem[];
    };

    static videos = (items: DuplicateParams): FootageItem[] => {
        return KT_ProjectDuplicate.__duplicateItems(items, "video") as FootageItem[];
    };

    static audio = (items: DuplicateParams): FootageItem[] => {
        return KT_ProjectDuplicate.__duplicateItems(items, "audio") as FootageItem[];
    };

    static images = (items: DuplicateParams): FootageItem | FootageItem[] | false => {
        return KT_ProjectDuplicate.__duplicateItems(items, "image") as FootageItem | FootageItem[] | false;
    };

    static solids = (items: DuplicateParams): FootageItem | FootageItem[] | false => {
        return KT_ProjectDuplicate.__duplicateItems(items, "solid") as FootageItem | FootageItem[] | false;
    };

    static items = (items: DuplicateParams): _ItemClasses[] => {
        return KT_ProjectDuplicate.__duplicateItems(items, "item") as _ItemClasses[];
    };

    private static __selectItems = (items: DuplicateParams, findType: string): _ItemClasses[] => {
        const itemsArray = items instanceof Array ? items : [items];
        const selectedItems: _ItemClasses[] = [];
        for (const item of itemsArray) {
            if (typeof item === "string") {
                const findMethod = findType + "s";
                if (typeof (find as any)[findMethod] === "function") {
                    const foundItems = (find as any)[findMethod](item);
                    selectedItems.push(...foundItems);
                }
            } else {
                selectedItems.push(item);
            }
        }
        return selectedItems;
    };

    private static __duplicateItems = (items: DuplicateParams, typeChecker: string): _ItemClasses[] => {
        const duplicates: _ItemClasses[] = [];
        const itemsArray = KT_ProjectDuplicate.__selectItems(items, typeChecker);
        for (const item of itemsArray) {
            const checker = is[typeChecker as keyof typeof is];
            if (!checker || !checker(item)) {
                continue;
            }
            let duplicator = "__duplicate" + typeChecker.charAt(0).toUpperCase() + typeChecker.slice(1);
            if (typeof (this as any)[duplicator] === "function") {
                const dup = (this as any)[duplicator](item);
                dup.parentFolder = item.parentFolder;
                if (dup) {
                    duplicates.push(dup);
                }
            }
        }
        return duplicates;
    };

    private static _duplicateComp = (comp: CompItem): CompItem | false => {
        return comp.duplicate() as CompItem;
    };

    private static _duplicateFolder = (folder: FolderItem): FolderItem | false => {
        const newFolder = add.folder({ name: folder.name + " copy", parentFolder: folder.parentFolder });
        for (let i = 1; i <= folder.numItems; i++) {
            const item = KT_ProjectDuplicate.__duplicateItems([folder.item(i)], "item");
            if (item.length > 0) {
                item[0].parentFolder = newFolder;
            }
        }
        return newFolder;
    };

    private static __duplicateFootage = (footage: FootageItem): FootageItem | false => {
        return false;
    };
}

export { KT_ProjectDuplicate };
