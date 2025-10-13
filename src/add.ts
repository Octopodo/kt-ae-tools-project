import { KT_Path as path } from "kt-io";
import { KT_ProjectMove as move } from "./move";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_ProjectFind as find } from "./find";

type CompOptions = {
    name: string;
    parentFolder?: FolderItem | string;
    width?: number;
    height?: number;
    pixelAspect?: number;
    duration?: number;
    frameRate?: number;
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

    private __sanitzeCompValues(options: CompOptions): CompOptions {
        options.width = options.width || this.__DEFAULT_COMP_WIDTH;
        options.height = options.height || this.__DEFAULT_COMP_HEIGHT;
        options.pixelAspect = options.pixelAspect || this.__DEFAULT_COMP_PIXEL_ASPECT;
        options.frameRate = options.frameRate || this.__DEFAULT_COMP_FRAME_RATE;
        options.duration = options.duration || this.__DEFAULT_COMP_DURATION;

        options.width = Math.min(Math.floor(options.width), this.__MAX_COMP_WIDTH);
        options.height = Math.min(Math.floor(options.height), this.__MAX_COMP_HEIGHT);
        options.pixelAspect = Math.min(options.pixelAspect, this.__MAX_COMP_PIXEL_ASPECT);
        options.frameRate = Math.min(Math.floor(options.frameRate), this.__MAX_COMP_FRAME_RATE);
        options.duration = Math.min(Math.floor(options.duration), this.__MAX_COMP_DURATION);
        options.width = Math.max(options.width, this.__MIN_COMP_WIDTH);
        options.height = Math.max(options.height, this.__MIN_COMP_HEIGHT);
        options.pixelAspect = Math.max(options.pixelAspect, this.__MIN_COMP_PIXEL_ASPECT);
        options.frameRate = Math.max(options.frameRate, this.__MIN_COMP_FRAME_RATE);
        options.duration = Math.max(options.duration, this.__MIN_COMP_DURATION);
        return options;
    }

    private __moveToFolder(item: _ItemClasses, options: CompOptions | FolderOptions) {
        if (!options.parentFolder) return;
        let targetFolder: FolderItem | false = false;
        if (is.folder(options.parentFolder)) {
            targetFolder = options.parentFolder;
        } else {
            const folders = find.folders({ name: options.parentFolder as string });
            if (!folders || folders.length === 0) return;
            targetFolder = folders[0];
        }
        move.move(item, targetFolder);
    }

    comp(options: CompOptions): CompItem | false {
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

        return comp;
    }

    compFromFootage(footage: _ItemClasses, options: CompOptions): CompItem | false {
        if (!is.footage(footage)) return false;
        options.name = path.stripFileExtension(footage.name) || "Comp";
        options.width = footage.width;
        options.height = footage.height;
        options.pixelAspect = footage.pixelAspect;
        options.duration = is.image(footage) ? footage.duration : this.__DEFAULT_COMP_DURATION;
        options.frameRate = footage.frameRate;

        const parsedOptions = this.__sanitzeCompValues(options);

        const comp = this.comp(parsedOptions);
        if (!is.comp(comp)) return false;
        comp.layers.add(footage);
        return comp;
    }

    folder(options: FolderOptions): FolderItem {
        const folder = app.project.items.addFolder(options.name);
        this.__moveToFolder(folder, options);

        return folder;
    }

    folderStructure(hierarchy: any): FolderItem | Boolean {
        return false;
    }
}

const KT_ProjectAdd = new __KT_ProjectAdd();
export { KT_ProjectAdd };
