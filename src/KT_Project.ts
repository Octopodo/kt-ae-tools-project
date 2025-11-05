import { KT_ProjectFind } from "./find";
import { KT_ProjectImport } from "./import";
import { KT_ProjectAdd } from "./add";
import { KT_ProjectMove } from "./move";
import { KT_ProjectRemove } from "./remove";
import { KT_ProjectDuplicate } from "./duplicate";
import { KT_AeProjectPath } from "./path";
class __KT_Project {
    private name = "KtAeProject";
    private version = "1.0.0";
    public find = KT_ProjectFind;
    public import = KT_ProjectImport;
    public add = KT_ProjectAdd;
    public move = KT_ProjectMove;
    public remove = KT_ProjectRemove;
    public duplicate = KT_ProjectDuplicate;
    public path = KT_AeProjectPath;
    constructor() {
        $.writeln("KtAeProject constructor");
    }
}

const KT_Project = new __KT_Project();
export { KT_Project };
