import { KT_AeProjectPath as path } from "./path";
import { KT_AeIs as is } from "kt-ae-is-checkers";

class __KT_ProjectRemove {
    /**
     * Removes items from the project.
     *
     * @param items - The item(s) to remove. Can be a single item, an array of items, or a path string.
     * @returns true if all removals succeeded, false otherwise.
     */
    remove(
        items: _ItemClasses | _ItemClasses[] | string,
        checker: (item: any) => boolean
    ): boolean {
        // Resolve items to remove
        let itemsToRemove: _ItemClasses[] = [];
        if (typeof items === "string") {
            const resolved = path.resolve(app.project.rootFolder, items);
            if (!resolved) {
                return false; // Invalid item path
            }
            itemsToRemove = [resolved];
        } else if (items instanceof Array) {
            itemsToRemove = items;
        } else {
            itemsToRemove = [items];
        }

        let removeOk: boolean = true;
        // Remove each item
        for (const item of itemsToRemove) {
            if (!checker(item)) {
                continue; // Item does not match the type checker
            }
            try {
                item.remove();
            } catch (e) {
                removeOk = false;
            }
        }

        return removeOk;
    }

    comp(items: _ItemClasses | _ItemClasses[] | string): boolean {
        return this.remove(items, is.comp);
    }

    folder(items: _ItemClasses | _ItemClasses[] | string): boolean {
        return this.remove(items, is.folder);
    }

    audio(items: _ItemClasses | _ItemClasses[] | string): boolean {
        return this.remove(items, is.audio);
    }

    footage(items: _ItemClasses | _ItemClasses[] | string): boolean {
        return this.remove(items, is.footage);
    }
    item(items: _ItemClasses | _ItemClasses[] | string): boolean {
        return this.remove(items, (item) => true);
    }

    image(items: _ItemClasses | _ItemClasses[] | string): boolean {
        return this.remove(items, is.image);
    }
    video(items: _ItemClasses | _ItemClasses[] | string): boolean {
        return this.remove(items, is.video);
    }
    solid(items: _ItemClasses | _ItemClasses[] | string): boolean {
        return this.remove(items, is.solid);
    }
}

const KT_ProjectRemove = new __KT_ProjectRemove();
export { KT_ProjectRemove };
