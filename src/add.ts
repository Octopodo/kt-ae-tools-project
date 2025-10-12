import { KT_ProjectMove as move } from "./move";
import { KT_AeProjectPath } from "./path";

type CompOptions = {
    name: string;
    folder?: FolderItem | string;
    width?: number;
    height?: number;
    pixelAspect?: number;
    duration?: number;
    frameRate?: number;
};

type FolderOptions = {
    name: string;
    parent?: FolderItem | string;
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

    private __sanitzeCompValues(
        width: number,
        height: number,
        pixelAspect: number,
        frameRate: number,
        duration: number
    ) {
        width = Math.min(Math.floor(width), this.__MAX_COMP_WIDTH);
        height = Math.min(Math.floor(height), this.__MAX_COMP_HEIGHT);
        pixelAspect = Math.min(pixelAspect, this.__MAX_COMP_PIXEL_ASPECT);
        frameRate = Math.min(Math.floor(frameRate), this.__MAX_COMP_FRAME_RATE);
        duration = Math.min(Math.floor(duration), this.__MAX_COMP_DURATION);
        width = Math.max(width, this.__MIN_COMP_WIDTH);
        height = Math.max(height, this.__MIN_COMP_HEIGHT);
        pixelAspect = Math.max(pixelAspect, this.__MIN_COMP_PIXEL_ASPECT);
        frameRate = Math.max(frameRate, this.__MIN_COMP_FRAME_RATE);
        duration = Math.max(duration, this.__MIN_COMP_DURATION);
        return { width, height, pixelAspect, frameRate, duration };
    }

    comp(options: CompOptions) {
        const name = options.name;
        let targetFolder: FolderItem = app.project.rootFolder;
        if (options.folder) {
            if (typeof options.folder === "string") {
                const resolved = KT_AeProjectPath.resolve(
                    app.project.rootFolder,
                    options.folder
                );
                if (resolved && resolved instanceof FolderItem) {
                    targetFolder = resolved as FolderItem;
                }
            } else {
                targetFolder = options.folder;
            }
        }

        const width = options.width || 1920;
        const height = options.height || 1080;
        const pixelAspect = options.pixelAspect || 1;
        const frameRate = options.frameRate || 25;
        const duration = options.duration || 10;

        const {
            width: w,
            height: h,
            pixelAspect: pa,
            frameRate: fr,
            duration: du,
        } = this.__sanitzeCompValues(
            width,
            height,
            pixelAspect,
            frameRate,
            duration
        );

        const comp = app.project.items.addComp(name, w, h, pa, du, fr);
        move.move(comp, targetFolder);

        return comp;
    }

    folder(options: FolderOptions): FolderItem {
        const name = options.name;
        let targetParent: FolderItem = app.project.rootFolder;
        if (options.parent) {
            if (typeof options.parent === "string") {
                const resolved = KT_AeProjectPath.resolve(
                    app.project.rootFolder,
                    options.parent
                );
                if (resolved && resolved instanceof FolderItem) {
                    targetParent = resolved as FolderItem;
                }
            } else {
                targetParent = options.parent;
            }
        }

        const folder = app.project.items.addFolder(name);
        move.move(folder, targetParent);

        return folder;
    }

    folderStructure(hierarchy: any): FolderItem | Boolean {
        return false;
    }
}

const KT_ProjectAdd = new __KT_ProjectAdd();
export { KT_ProjectAdd };
