import { KT_AeProjectPath } from "./path";
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

class __KT_ProjectFind {
    private isInSubtree(item: _ItemClasses, root: FolderItem): boolean {
        let current: FolderItem | Project = item.parentFolder;
        while (current) {
            if (current === root) return true;
            if (current instanceof Project) break;
            current = current.parentFolder;
        }
        return false;
    }

    item(
        options: FindProjectOptions = { root: app.project.rootFolder }
    ): _ItemClasses[] | Boolean {
        const root = getRoot(options);
        const items: _ItemClasses[] = [];
        if (options.id) {
            try {
                const item = app.project.itemByID(options.id);
                if (
                    item &&
                    this.isInSubtree(item, root) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    items.push(item);
                }
            } catch (e) {}
        } else {
            for (let i = 1; i <= app.project.numItems; i++) {
                const item = app.project.item(i);
                if (
                    this.isInSubtree(item, root) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    items.push(item);
                }
            }
        }
        return items.length > 0 ? items : false;
    }

    folder(
        options: FindProjectOptions = { root: app.project.rootFolder }
    ): FolderItem | FolderItem[] | Boolean {
        const root = getRoot(options);
        const folders: FolderItem[] = [];
        if (options.id) {
            try {
                const item = app.project.itemByID(options.id);
                if (
                    item &&
                    is.folder(item) &&
                    this.isInSubtree(item, root) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    folders.push(item as FolderItem);
                }
            } catch (e) {}
        } else {
            for (let i = 1; i <= app.project.numItems; i++) {
                const item = app.project.item(i);
                if (
                    this.isInSubtree(item, root) &&
                    is.folder(item) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    folders.push(item as FolderItem);
                }
            }
        }
        if (folders.length === 0) return false;
        if (options.name || options.id || options.path) return folders[0];
        return folders;
    }

    comp(
        options: FindProjectOptions = { root: app.project.rootFolder }
    ): CompItem[] | Boolean {
        const root = getRoot(options);
        const comps: CompItem[] = [];
        if (options.id) {
            try {
                const item = app.project.itemByID(options.id);
                if (
                    item &&
                    is.comp(item) &&
                    this.isInSubtree(item, root) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    comps.push(item as CompItem);
                }
            } catch (e) {}
        } else {
            for (let i = 1; i <= app.project.numItems; i++) {
                const item = app.project.item(i);
                if (
                    this.isInSubtree(item, root) &&
                    is.comp(item) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    comps.push(item as CompItem);
                }
            }
        }
        return comps.length > 0 ? comps : false;
    }

    footage(
        options: FindProjectOptions = { root: app.project.rootFolder }
    ): FootageItem[] | Boolean {
        const root = getRoot(options);
        const footage: FootageItem[] = [];
        if (options.id) {
            try {
                const item = app.project.itemByID(options.id);
                if (
                    item &&
                    is.footage(item) &&
                    this.isInSubtree(item, root) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    footage.push(item as FootageItem);
                }
            } catch (e) {}
        } else {
            for (let i = 1; i <= app.project.numItems; i++) {
                const item = app.project.item(i);
                if (
                    this.isInSubtree(item, root) &&
                    is.footage(item) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    footage.push(item as FootageItem);
                }
            }
        }
        return footage.length > 0 ? footage : false;
    }

    audio(
        options: FindProjectOptions = { root: app.project.rootFolder }
    ): FootageItem[] | Boolean {
        const root = getRoot(options);
        const audio: FootageItem[] = [];
        if (options.id) {
            try {
                const item = app.project.itemByID(options.id);
                if (
                    item &&
                    is.audio(item) &&
                    this.isInSubtree(item, root) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    audio.push(item as FootageItem);
                }
            } catch (e) {}
        } else {
            for (let i = 1; i <= app.project.numItems; i++) {
                const item = app.project.item(i);
                if (
                    this.isInSubtree(item, root) &&
                    is.audio(item) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    audio.push(item as FootageItem);
                }
            }
        }
        return audio.length > 0 ? audio : false;
    }

    video(
        options: FindProjectOptions = { root: app.project.rootFolder }
    ): FootageItem[] | Boolean {
        const root = getRoot(options);
        const video: FootageItem[] = [];
        if (options.id) {
            try {
                const item = app.project.itemByID(options.id);
                if (
                    item &&
                    is.video(item) &&
                    this.isInSubtree(item, root) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    video.push(item as FootageItem);
                }
            } catch (e) {}
        } else {
            for (let i = 1; i <= app.project.numItems; i++) {
                const item = app.project.item(i);
                if (
                    this.isInSubtree(item, root) &&
                    is.video(item) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    video.push(item as FootageItem);
                }
            }
        }
        return video.length > 0 ? video : false;
    }

    image(
        options: FindProjectOptions = { root: app.project.rootFolder }
    ): FootageItem[] | Boolean {
        const root = getRoot(options);
        const images: FootageItem[] = [];
        if (options.id) {
            try {
                const item = app.project.itemByID(options.id);
                if (
                    item &&
                    is.image(item) &&
                    this.isInSubtree(item, root) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    images.push(item as FootageItem);
                }
            } catch (e) {}
        } else {
            for (let i = 1; i <= app.project.numItems; i++) {
                const item = app.project.item(i);
                if (
                    this.isInSubtree(item, root) &&
                    is.image(item) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    images.push(item as FootageItem);
                }
            }
        }
        return images.length > 0 ? images : false;
    }

    solid(
        options: FindProjectOptions = { root: app.project.rootFolder }
    ): _ItemClasses[] | Boolean {
        const root = getRoot(options);
        const solids: _ItemClasses[] = [];
        if (options.id) {
            try {
                const item = app.project.itemByID(options.id);
                if (
                    item &&
                    is.solid(item) &&
                    this.isInSubtree(item, root) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    solids.push(item);
                }
            } catch (e) {}
        } else {
            for (let i = 1; i <= app.project.numItems; i++) {
                const item = app.project.item(i);
                if (
                    this.isInSubtree(item, root) &&
                    is.solid(item) &&
                    (!options.name || item.name === options.name) &&
                    (!options.path ||
                        KT_AeProjectPath.get(item) === options.path)
                ) {
                    solids.push(item);
                }
            }
        }
        return solids.length > 0 ? solids : false;
    }
}

const KT_ProjectFind = new __KT_ProjectFind();
export { KT_ProjectFind };
