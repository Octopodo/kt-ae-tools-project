import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_AeProjectPath as path } from "./path";

class __KT_ProjectDuplicate {
    private __duplicateComp(comp: CompItem): CompItem | false {
        try {
            const newComp = app.project.items.addComp(
                comp.name + " copy",
                comp.width,
                comp.height,
                comp.pixelAspect,
                comp.duration,
                comp.frameRate
            );
            newComp.bgColor = comp.bgColor;
            newComp.resolutionFactor = comp.resolutionFactor;
            newComp.shutterAngle = comp.shutterAngle;
            newComp.shutterPhase = comp.shutterPhase;
            newComp.motionBlur = comp.motionBlur;
            newComp.draft3d = comp.draft3d;
            newComp.frameBlending = comp.frameBlending;
            newComp.preserveNestedFrameRate = comp.preserveNestedFrameRate;
            newComp.preserveNestedResolution = comp.preserveNestedResolution;
            return newComp;
        } catch (e) {
            return false;
        }
    }

    private __duplicateFolder(folder: FolderItem): FolderItem | false {
        try {
            const newFolder = app.project.items.addFolder(
                folder.name + " copy"
            );
            return newFolder;
        } catch (e) {
            return false;
        }
    }

    private __duplicateFootage(footage: FootageItem): FootageItem | false {
        try {
            if (footage.mainSource instanceof FileSource) {
                const file = footage.mainSource.file;
                const importOptions = new ImportOptions(file);
                const newFootage = app.project.importFile(importOptions);
                if (newFootage) {
                    newFootage.name = footage.name + " copy";
                    return newFootage as FootageItem;
                }
            } else if (footage.mainSource instanceof SolidSource) {
                const solid = footage.mainSource;
                const newSolid = (app.project.items as any).addSolid(
                    solid.color,
                    footage.name + " copy",
                    footage.width,
                    footage.height,
                    footage.pixelAspect,
                    footage.duration
                );
                return newSolid;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    comp(
        itemOrItemsOrPath: _ItemClasses | _ItemClasses[] | string
    ): CompItem | CompItem[] | false {
        let itemsToDuplicate: CompItem[] = [];
        if (typeof itemOrItemsOrPath === "string") {
            const resolved = path.getComps(
                app.project.rootFolder,
                itemOrItemsOrPath
            );
            if (!resolved) return false;
            itemsToDuplicate = [resolved ];
        } else if (itemOrItemsOrPath instanceof Array) {
            for (let i = 0; i < itemOrItemsOrPath.length; i++) {
                const item = itemOrItemsOrPath[i];
                if (is.comp(item)) itemsToDuplicate.push(item as CompItem);
            }
        } else {
            if (!is.comp(itemOrItemsOrPath)) return false;
            itemsToDuplicate = [itemOrItemsOrPath as CompItem];
        }

        const duplicated: CompItem[] = [];
        for (const item of itemsToDuplicate) {
            const dup = this.__duplicateComp(item);
            if (dup) duplicated.push(dup);
        }
        return duplicated.length === 1
            ? duplicated[0]
            : duplicated.length > 0
              ? duplicated
              : false;
    }

    folder(
        itemOrItemsOrPath: _ItemClasses | _ItemClasses[] | string
    ): FolderItem | FolderItem[] | false {
        let itemsToDuplicate: FolderItem[] = [];
        if (typeof itemOrItemsOrPath === "string") {
            const resolved = path.resolve(
                app.project.rootFolder,
                itemOrItemsOrPath
            );
            if (!resolved || !is.folder(resolved)) return false;
            itemsToDuplicate = [resolved as FolderItem];
        } else if (itemOrItemsOrPath instanceof Array) {
            for (let i = 0; i < itemOrItemsOrPath.length; i++) {
                const item = itemOrItemsOrPath[i];
                if (is.folder(item)) itemsToDuplicate.push(item as FolderItem);
            }
        } else {
            if (!is.folder(itemOrItemsOrPath)) return false;
            itemsToDuplicate = [itemOrItemsOrPath as FolderItem];
        }

        const duplicated: FolderItem[] = [];
        for (const item of itemsToDuplicate) {
            const dup = this.__duplicateFolder(item);
            if (dup) duplicated.push(dup);
        }
        return duplicated.length === 1
            ? duplicated[0]
            : duplicated.length > 0
              ? duplicated
              : false;
    }

    footage(
        itemOrItemsOrPath: _ItemClasses | _ItemClasses[] | string
    ): FootageItem | FootageItem[] | false {
        let itemsToDuplicate: FootageItem[] = [];
        if (typeof itemOrItemsOrPath === "string") {
            const resolved = path.resolve(
                app.project.rootFolder,
                itemOrItemsOrPath
            );
            if (!resolved || !is.footage(resolved)) return false;
            itemsToDuplicate = [resolved as FootageItem];
        } else if (itemOrItemsOrPath instanceof Array) {
            for (let i = 0; i < itemOrItemsOrPath.length; i++) {
                const item = itemOrItemsOrPath[i];
                if (is.footage(item))
                    itemsToDuplicate.push(item as FootageItem);
            }
        } else {
            if (!is.footage(itemOrItemsOrPath)) return false;
            itemsToDuplicate = [itemOrItemsOrPath as FootageItem];
        }

        const duplicated: FootageItem[] = [];
        for (const item of itemsToDuplicate) {
            const dup = this.__duplicateFootage(item);
            if (dup) duplicated.push(dup);
        }
        return duplicated.length === 1
            ? duplicated[0]
            : duplicated.length > 0
              ? duplicated
              : false;
    }

    video(
        itemOrItemsOrPath: _ItemClasses | _ItemClasses[] | string
    ): FootageItem | FootageItem[] | false {
        return this.footage(itemOrItemsOrPath); // Video is a type of footage
    }

    audio(
        itemOrItemsOrPath: _ItemClasses | _ItemClasses[] | string
    ): FootageItem | FootageItem[] | false {
        return this.footage(itemOrItemsOrPath); // Audio is a type of footage
    }

    image(
        itemOrItemsOrPath: _ItemClasses | _ItemClasses[] | string
    ): FootageItem | FootageItem[] | false {
        return this.footage(itemOrItemsOrPath); // Image is a type of footage
    }

    solid(
        itemOrItemsOrPath: _ItemClasses | _ItemClasses[] | string
    ): FootageItem | FootageItem[] | false {
        return this.footage(itemOrItemsOrPath); // Solid is a type of footage
    }

    item(
        itemOrItemsOrPath: _ItemClasses | _ItemClasses[] | string
    ): _ItemClasses | _ItemClasses[] | false {
        let itemsToDuplicate: _ItemClasses[] = [];
        if (typeof itemOrItemsOrPath === "string") {
            const resolved = path.resolve(
                app.project.rootFolder,
                itemOrItemsOrPath
            );
            if (!resolved) return false;
            itemsToDuplicate = [resolved];
        } else if (itemOrItemsOrPath instanceof Array) {
            itemsToDuplicate = itemOrItemsOrPath;
        } else {
            itemsToDuplicate = [itemOrItemsOrPath];
        }

        const duplicated: _ItemClasses[] = [];
        for (const item of itemsToDuplicate) {
            let dup: _ItemClasses | false = false;
            if (is.comp(item)) {
                dup = this.__duplicateComp(item as CompItem);
            } else if (is.folder(item)) {
                dup = this.__duplicateFolder(item as FolderItem);
            } else if (is.footage(item)) {
                dup = this.__duplicateFootage(item as FootageItem);
            }
            if (dup) duplicated.push(dup);
        }
        return duplicated.length === 1
            ? duplicated[0]
            : duplicated.length > 0
              ? duplicated
              : false;
    }
}

const KT_ProjectDuplicate = new __KT_ProjectDuplicate();
export { KT_ProjectDuplicate };
