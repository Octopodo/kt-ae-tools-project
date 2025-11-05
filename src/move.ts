import { KT_AeProjectPath } from "./path";

class __KT_ProjectMove {
    /**
     * Moves items to a specified destination folder.
     *
     * @param items - The item(s) to move. Can be a single item, an array of items, or a path string.
     * @param destination - The destination folder. Can be a FolderItem or a path string.
     * @returns true if all moves succeeded, false otherwise.
     */
    move = (items: _ItemClasses | _ItemClasses[] | string, destination: FolderItem | string): boolean => {
        // Resolve destination folder
        let destFolder: FolderItem | null = null;
        if (typeof destination === "string") {
            const resolved = KT_AeProjectPath.resolve(app.project.rootFolder, destination);
            if (!resolved || !(resolved instanceof FolderItem)) {
                return false; // Invalid destination path or not a folder
            }
            destFolder = resolved as FolderItem;
        } else {
            destFolder = destination;
        }

        // Resolve items to move
        let itemsToMove: _ItemClasses[] = [];
        if (typeof items === "string") {
            const resolved = KT_AeProjectPath.resolve(app.project.rootFolder, items);
            if (!resolved) {
                return false; // Invalid item path
            }
            itemsToMove = [resolved];
        } else if (items instanceof Array) {
            itemsToMove = items;
        } else {
            itemsToMove = [items];
        }

        // Move each item
        for (const item of itemsToMove) {
            try {
                item.parentFolder = destFolder;
            } catch (e) {
                return false; // Move failed
            }
        }

        return true; // All moves succeeded
    };
}

const KT_ProjectMove = new __KT_ProjectMove();
export { KT_ProjectMove };
