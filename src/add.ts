import { KT_Path as path } from "kt-io";
import { KT_ProjectMove as move } from "./move";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_ProjectFind as find } from "./find";
import { KT_AeProjectPath } from "./path";
import { KT_AeCache as cache } from "./lazyCache";

type CompOptions = {
    name: string;
    parentFolder?: FolderItem | string;
    width?: number;
    height?: number;
    pixelAspect?: number;
    duration?: number;
    frameRate?: number;
};

type SolidOptions = {
    name: string;
    parentFolder?: FolderItem | string;
    width?: number;
    height?: number;
    pixelAspect?: number;
    duration?: number;
    color?: [number, number, number];
};

type FolderOptions = {
    name: string;
    parentFolder?: FolderItem | string;
};

class __KT_ProjectAdd {
    private __MAX_COMP_WIDTH = 30000;
    private __MAX_COMP_HEIGHT = 30000;
    private __MIN_COMP_WIDTH = 4;
    private __MIN_COMP_HEIGHT = 4;
    private __MIN_COMP_DURATION = 1;
    private __MAX_COMP_DURATION = 36000;
    private __MIN_COMP_FRAME_RATE = 1;
    private __MAX_COMP_FRAME_RATE = 240;
    private __MAX_COMP_PIXEL_ASPECT = 10;
    private __MIN_COMP_PIXEL_ASPECT = 0.1;

    //TODO: move these defaults to a config file. Implement defaults system
    private __DEFAULT_COMP_WIDTH = 1920;
    private __DEFAULT_COMP_HEIGHT = 1080;
    private __DEFAULT_COMP_PIXEL_ASPECT = 1;
    private __DEFAULT_COMP_FRAME_RATE = 25;
    private __DEFAULT_COMP_DURATION = 10;

    private __sanitzeCompValues = (options: CompOptions): CompOptions => {
        options.width = options.width || this.__DEFAULT_COMP_WIDTH;
        options.height = options.height || this.__DEFAULT_COMP_HEIGHT;
        options.pixelAspect = options.pixelAspect || this.__DEFAULT_COMP_PIXEL_ASPECT;
        options.frameRate = options.frameRate || this.__DEFAULT_COMP_FRAME_RATE;
        options.duration = options.duration || this.__DEFAULT_COMP_DURATION;

        options.width = Math.max(Math.min(Math.floor(options.width), this.__MAX_COMP_WIDTH), this.__MIN_COMP_WIDTH);
        options.height = Math.max(Math.min(Math.floor(options.height), this.__MAX_COMP_HEIGHT), this.__MIN_COMP_HEIGHT);
        options.pixelAspect = Math.max(
            Math.min(options.pixelAspect, this.__MAX_COMP_PIXEL_ASPECT),
            this.__MIN_COMP_PIXEL_ASPECT
        );
        options.frameRate = Math.max(
            Math.min(options.frameRate, this.__MAX_COMP_FRAME_RATE),
            this.__MIN_COMP_FRAME_RATE
        );
        options.duration = Math.max(Math.min(options.duration, this.__MAX_COMP_DURATION), this.__MIN_COMP_DURATION);

        return options;
    };

    private __sanitzeSolidValues = (options: SolidOptions): SolidOptions => {
        options.width = options.width || this.__DEFAULT_COMP_WIDTH;
        options.height = options.height || this.__DEFAULT_COMP_HEIGHT;
        options.pixelAspect = options.pixelAspect || this.__DEFAULT_COMP_PIXEL_ASPECT;
        options.duration = options.duration || this.__DEFAULT_COMP_DURATION;
        options.color = options.color || [1, 1, 1];
        options.width = Math.min(Math.floor(options.width), this.__MAX_COMP_WIDTH);
        options.height = Math.min(Math.floor(options.height), this.__MAX_COMP_HEIGHT);
        options.pixelAspect = Math.min(options.pixelAspect, this.__MAX_COMP_PIXEL_ASPECT);
        options.duration = Math.min(options.duration, this.__MAX_COMP_DURATION);
        for (let i = 0; i < options.color.length; i++) {
            options.color[i] = Math.min(Math.max(options.color[i], 0), 1);
        }
        return options;
    };

    private __moveToFolder = (item: _ItemClasses, options: CompOptions | FolderOptions) => {
        if (!options.parentFolder) return;
        let targetFolder: FolderItem | false = false;
        if (is.folder(options.parentFolder)) {
            targetFolder = options.parentFolder;
        } else {
            const folders = find.folders(options.parentFolder);
            if (!folders || folders.length === 0) return;
            targetFolder = folders[0];
        }
        move.move(item, targetFolder);
    };

    comp = (options: CompOptions): CompItem | false => {
        const name = options.name;
        options = this.__sanitzeCompValues(options);
        const comp = app.project.items.addComp(
            name,
            options.width!,
            options.height!,
            options.pixelAspect!,
            options.duration!,
            options.frameRate!
        );
        this.__moveToFolder(comp, options);
        cache.add(comp);
        return comp;
    };

    compFromFootage = (footage: _ItemClasses, options: CompOptions): CompItem | false => {
        if (!is.footage(footage) && !is.comp(footage)) return false;
        options.name = options.name || decodeURI(path.stripFileExtension(footage.name) || "Comp");
        options.width = footage.width;
        options.height = footage.height;
        options.pixelAspect = footage.pixelAspect;
        options.duration = is.image(footage) ? this.__DEFAULT_COMP_DURATION : footage.duration;
        options.frameRate = footage.frameRate;

        const parsedOptions = this.__sanitzeCompValues(options);

        const comp = this.comp(parsedOptions);
        if (!is.comp(comp)) return false;
        comp.layers.add(footage);
        return comp;
    };

    folder = (options: FolderOptions): FolderItem => {
        const folder = app.project.items.addFolder(options.name);
        this.__moveToFolder(folder, options);
        cache.add(folder);
        return folder;
    };

    //Look for a solution for invalid object whe deleting comp
    private solid = (options: SolidOptions): FootageItem | false => {
        options = this.__sanitzeSolidValues(options);
        try {
            const tempComp = this.comp({
                name: "TempCompForSolid",
                width: options.width!,
                height: options.height!,
                pixelAspect: options.pixelAspect!,
                duration: options.duration!,
            });
            if (!tempComp) return false;
            const solid = tempComp.layers.addSolid(
                options.color!,
                options.name,
                options.width!,
                options.height!,
                options.pixelAspect!,
                options.duration!
            );
            if (!solid) {
                tempComp.remove();
                return false;
            }

            this.__moveToFolder(solid.source, options);
            tempComp.remove();
            return solid.source;
        } catch (e) {
            return false;
        }
    };

    folderStructure = (hierarchy: any): FolderItem | Boolean => {
        return false;
    };
}

const KT_ProjectAdd = new __KT_ProjectAdd();
export { KT_ProjectAdd };
