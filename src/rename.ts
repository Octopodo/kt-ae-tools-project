import { KT_AeCache } from "./lazyCache";

class _KT_AeProjectRename {
    rename(item: _ItemClasses, name: string) {
        item.name = name;
        KT_AeCache.rename(item, name);
    }
}

export const KT_AeRename = new _KT_AeProjectRename();
