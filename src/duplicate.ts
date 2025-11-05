import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_ProjectAdd as add } from "./add";
import { KT_ProjectMove as move } from "./move";
import { KT_AeProjectPath as path } from "./path";
import { KT_ProjectFind as find } from "./find";

class __KT_ProjectDuplicate {
    private __duplicateComp = (comp: CompItem): CompItem | false => {
        return comp.duplicate() as CompItem;
    };

    private __duplicateFolder = (folder: FolderItem): FolderItem | false => {
        const newFolder = add.folder({ name: folder.name + " copy", parentFolder: folder.parentFolder });
        for (let i = 1; i <= folder.numItems; i++) {
            const item = this.__duplicateItems([folder.item(i)], "item");
            if (item.length > 0) {
                item[0].parentFolder = newFolder;
            }
        }
        return newFolder;
    };

    private __duplicateFootage = (footage: FootageItem): FootageItem | false => {
        return false;
    };

    private __duplicateItems = (items: any[], typeChecker: string): _ItemClasses[] => {
        const duplicates: _ItemClasses[] = [];

        for (const item of items) {
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

    comps = (items: _ItemClasses | _ItemClasses[] | string): CompItem[] => {
        const selectedItems = this.__selectItems(items, "comps");
        return this.__duplicateItems(selectedItems, "comp") as CompItem[];
    };

    folders = (items: _ItemClasses | _ItemClasses[] | string): FolderItem[] => {
        const selectedItems = this.__selectItems(items, "folders");
        return this.__duplicateItems(selectedItems, "folder") as FolderItem[];
    };

    footage = (items: _ItemClasses | _ItemClasses[] | string): FootageItem[] => {
        const selectedItems = this.__selectItems(items, "footage");
        return this.__duplicateItems(selectedItems, "footage") as FootageItem[];
    };

    videos = (items: _ItemClasses | _ItemClasses[] | string): FootageItem[] => {
        const selectedItems = this.__selectItems(items, "videos");
        return this.__duplicateItems(selectedItems, "video") as FootageItem[];
    };

    audio = (items: _ItemClasses | _ItemClasses[] | string): FootageItem[] => {
        const selectedItems = this.__selectItems(items, "audios");
        return this.__duplicateItems(selectedItems, "audio") as FootageItem[];
    };

    images = (items: _ItemClasses | _ItemClasses[] | string): FootageItem | FootageItem[] | false => {
        const selectedItems = this.__selectItems(items, "images");
        return this.__duplicateItems(selectedItems, "image") as FootageItem | FootageItem[] | false;
    };

    solids = (items: _ItemClasses | _ItemClasses[] | string): FootageItem | FootageItem[] | false => {
        const selectedItems = this.__selectItems(items, "solids");
        return this.__duplicateItems(selectedItems, "solid") as FootageItem | FootageItem[] | false;
    };

    items = (items: _ItemClasses | _ItemClasses[] | string): _ItemClasses[] => {
        const selectedItems = this.__selectItems(items, "items");
        return this.__duplicateItems(selectedItems, "item") as _ItemClasses[];
    };

    private __selectItems = (
        items: _ItemClasses | _ItemClasses[] | string | string[],
        findType: string
    ): _ItemClasses[] => {
        const itemsArray = items instanceof Array ? items : [items];
        const selectedItems: _ItemClasses[] = [];
        for (const item of itemsArray) {
            if (typeof item === "string") {
                if (typeof (find as any)[findType] === "function") {
                    const foundItems = (find as any)[findType](item);
                    selectedItems.push(...foundItems);
                }
            } else {
                selectedItems.push(item);
            }
        }
        return selectedItems;
    };
}

const KT_ProjectDuplicate = new __KT_ProjectDuplicate();
export { KT_ProjectDuplicate };
