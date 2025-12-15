import { KT_ProjectFind } from "./find";
import { KT_ProjectImport } from "./import";
import { KT_ProjectAdd } from "./add";
import { KT_ProjectMove } from "./move";
import { KT_ProjectRemove } from "./remove";
import { KT_ProjectDuplicate } from "./duplicate";
import { KT_AeProjectPath } from "./path";
import { KT_ProjectRender } from "./render";
import { KT_AeRename } from "./rename";
class __KT_Project {
    private name = "KT_AeProject";
    private version = "1.1.0";
    public add = KT_ProjectAdd;
    public duplicate = KT_ProjectDuplicate;
    public find = KT_ProjectFind;
    public import = KT_ProjectImport;
    public move = KT_ProjectMove;
    public path = KT_AeProjectPath;
    public remove = KT_ProjectRemove;
    public rename = KT_AeRename;
    public render = KT_ProjectRender;
    constructor() {
        $.writeln("KT_AeProject constructor");
    }
}

const KT_Project = new __KT_Project();
export { KT_Project };
