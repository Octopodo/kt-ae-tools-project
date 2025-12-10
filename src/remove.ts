import { KT_AeProjectPath as path } from "./path";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_LazyCache as cache } from "./lazyCache";
class __KT_ProjectRemove {
    /**
     * Removes items from the project.
     *
     * @param items - The item(s) to remove. Can be a single item, an array of items, or a path string.
     * @returns true if all removals succeeded, false otherwise.
     */
    remove = (items: _ItemClasses | _ItemClasses[], checker: (item: any) => boolean): boolean => {
        // Resolve items to remove
        let itemsToRemove: _ItemClasses[] = [];
        if (Array.isArray(items)) {
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
                const lc = cache;
                $.write(lc);
                cache.remove(item);
                item.remove();
            } catch (e) {
                removeOk = false;
            }
        }

        return removeOk;
    };

    comp = (items: _ItemClasses | _ItemClasses[]): boolean => {
        return this.remove(items, is.comp);
    };

    folder = (items: _ItemClasses | _ItemClasses[]): boolean => {
        return this.remove(items, is.folder);
    };

    audio = (items: _ItemClasses | _ItemClasses[]): boolean => {
        return this.remove(items, is.audio);
    };

    footage = (items: _ItemClasses | _ItemClasses[]): boolean => {
        return this.remove(items, is.footage);
    };
    item = (items: _ItemClasses | _ItemClasses[]): boolean => {
        return this.remove(items, (item) => true);
    };

    image = (items: _ItemClasses | _ItemClasses[]): boolean => {
        return this.remove(items, is.image);
    };
    video = (items: _ItemClasses | _ItemClasses[]): boolean => {
        return this.remove(items, is.video);
    };
    solid = (items: _ItemClasses | _ItemClasses[]): boolean => {
        return this.remove(items, is.solid);
    };
}

const KT_ProjectRemove = new __KT_ProjectRemove();
export { KT_ProjectRemove };
