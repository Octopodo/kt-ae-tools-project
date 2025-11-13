import { KT_Path, KT_IoUtils, type KT_Descriptor, KT_FolderDescriptor } from "kt-io";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_ProjectAdd as add } from "./add";
import { aeExtensions } from ".//aeExtensionValidators";
import { KT_ProjectFind as find } from "./find";
import { KT_AeProjectPath } from "./path";
type KT_ImportOptionsParams = {
    path: string | string[]; // Path on disk to import from
    recursive?: boolean; // Whether to import folders recursively
    flat?: boolean; // Whether to import folder contents flatly
    parent?: FolderItem | string; // Parent folder in the project to import into
    importAs?: string; // Force import as a specific type: "footage", "comp", "folder"
    toComp?: boolean; // Whether to import footage as a new comp
    asSequence?: boolean; // Whether to import footage as a sequence
    footageFolder?: FolderItem | string; // Folder to import footage into
    compFolder?: FolderItem | string; // Folder to import comps into. Only used if importAs is "comp" or toComp is true
    importOptions?: ImportOptions; // Additional import options passed to app.project.importFile
    returnAs?: "comp" | "comps" | ""; // Return imported items as comps if toComp is true
};

type KT_ImportOptions = {
    path: string[];
    recursive: boolean;
    flat: boolean;
    parent: FolderItem | string | undefined;
    importAs: string | undefined;
    toComp: boolean;
    asSequence: boolean;
    footageFolder: FolderItem | string | undefined;
    compFolder: FolderItem | string | undefined;
    importOptions: ImportOptions | undefined;
    returnAs: "comp" | "comps" | "";
};
type KT_ImportSingleParams = string | string[];

type KT_ImportParams = KT_ImportOptionsParams | KT_ImportSingleParams;

//Helper temp functions
//TODO: move to kt-ae-is-checkers

function isFile(path: string): boolean {
    const file = File(path);
    return file.constructor === File && file.exists;
}

function isFolder(path: string): boolean {
    const folder = Folder(path);
    return folder.constructor === Folder && folder.exists;
}

class __KT_ProjectImport {
    folders = (options: KT_ImportParams, fileChecker = (file: string | File) => true): _ItemClasses[] => {
        const tempOptions = this._sanitizeParams(options);
        const paths = [];
        if (tempOptions.flat) {
            for (let i = 0; i < tempOptions.path.length; i++) {
                const tempPaths = KT_IoUtils.scanFolder(tempOptions.path[i], tempOptions.recursive).getPaths();
                paths.push(...tempPaths);
            }
            tempOptions.path = paths;
            return this._importFiles(tempOptions, fileChecker);
        } else {
            tempOptions.recursive = true;
            const folders = [];
            for (let i = 0; i < tempOptions.path.length; i++) {
                const folderTree = KT_IoUtils.scanFolder(tempOptions.path[i], tempOptions.recursive);
                const importedItems = this._importFolderRecursive(tempOptions, folderTree, fileChecker);
                folders.push(...importedItems);
            }
            return folders;
        }
    };

    files = (options: KT_ImportParams): _ItemClasses[] => {
        return this._importFiles(options, (file) => this.isValidExtension(file));
    };

    audios = (options: KT_ImportParams): _ItemClasses[] => {
        const imported = this._importFiles(options, (file) => this.isValidExtension(file, "audio"));

        return imported;
    };

    videos = (options: KT_ImportParams): _ItemClasses[] => {
        const imported = this._importFiles(options, (file) => this.isValidExtension(file, "video"));
        return imported;
    };

    images = (options: KT_ImportParams): _ItemClasses[] => {
        const imported = this._importFiles(options, (file) => this.isValidExtension(file, "image"));
        return imported;
    };

    sequences = (options: KT_ImportParams): _ItemClasses[] => {
        const imported = this._importFiles(options, (file) => this.isValidExtension(file, "sequence"));
        return imported;
    };
    footage = (options: KT_ImportParams): _ItemClasses[] => {
        const imported = this._importFiles(
            options,
            (file) =>
                this.isValidExtension(file, "image") ||
                this.isValidExtension(file, "video") ||
                this.isValidExtension(file, "audio")
        );
        return imported;
    };

    private _importFolderRecursive = (
        options: KT_ImportOptionsParams,
        folderTree: KT_FolderDescriptor,
        fileChecker = (file: string | File) => true
    ): _ItemClasses[] => {
        const importedItems: _ItemClasses[] = [];
        if (folderTree.type !== "folder") {
            return importedItems;
        }
        const newFolder = add.folder({ name: folderTree.name, parentFolder: options.parent });
        options = this._sanitizeParams(options);

        for (const child of folderTree.contents) {
            if (child.type === "folder") {
                const subOptions: KT_ImportParams = this._sanitizeParams(options);
                subOptions.parent = newFolder;
                subOptions.path = [child.path];
                importedItems.push(
                    ...this._importFolderRecursive(subOptions, child as KT_FolderDescriptor, fileChecker)
                );
            } else {
                const tempOptions: KT_ImportParams = this._sanitizeParams(options);
                tempOptions.path = [child.path];
                tempOptions.parent = newFolder;
                importedItems.push(...this._importFiles(tempOptions, fileChecker));
            }
        }
        return importedItems;
    };

    private _importFiles = (
        options: KT_ImportParams,
        fileChecker: (file: File | string) => boolean = (file) => true
    ): _ItemClasses[] => {
        const importedItems: _ItemClasses[] = [];
        const tempOptions = this._sanitizeParams(options);
        try {
            for (let i = 0; i < tempOptions.path.length; i++) {
                const path = tempOptions.path[i];
                if (isFolder(path)) {
                    const tempOptions: KT_ImportParams = this._sanitizeParams(options);
                    tempOptions.path = [path];
                    importedItems.push(...this.folders(tempOptions, fileChecker));
                    continue;
                }
                const importOptions = this._parseImportOptions(path, tempOptions);

                if (!fileChecker(importOptions.file)) {
                    continue;
                }
                const importedItem = app.project.importFile(importOptions);
                //sanitize name

                if (tempOptions.parent) {
                    if (is.folder(tempOptions.parent)) {
                        importedItem.parentFolder = tempOptions.parent;
                    } else if (typeof tempOptions.parent === "string") {
                        const parentFolders = find.folders(tempOptions.parent);
                        if (parentFolders.length > 0) {
                            importedItem.parentFolder = parentFolders[0];
                        } else {
                            const targetFolder = add.folder({ name: tempOptions.parent });
                            importedItem.parentFolder = targetFolder;
                        }
                    }
                }
                if (tempOptions.footageFolder && is.footage(importedItem)) {
                    const targetFolder =
                        typeof tempOptions.footageFolder === "string"
                            ? find.folders(tempOptions.footageFolder)[0]
                            : tempOptions.footageFolder;
                    if (targetFolder) {
                        importedItem.parentFolder = targetFolder;
                    } else {
                        const newFolder = add.folder({ name: tempOptions.footageFolder as string });
                        importedItem.parentFolder = newFolder;
                    }
                }
                if (tempOptions.toComp && importOptions.importAs !== ImportAsType.COMP && is.footage(importedItem)) {
                    const compName = KT_Path.stripFileExtension(importedItem.name) || "Comp";
                    const comp = add.compFromFootage(importedItem, {
                        name: KT_AeProjectPath.decodeItemName(compName),
                        parentFolder: typeof tempOptions.compFolder === "string" ? tempOptions.compFolder : undefined,
                    });
                    if (comp) {
                        if (tempOptions.compFolder) {
                            const targetFolder =
                                typeof tempOptions.compFolder === "string"
                                    ? find.folders(tempOptions.compFolder)[0]
                                    : tempOptions.compFolder;
                            if (targetFolder) {
                                comp.parentFolder = targetFolder;
                            } else {
                                const newFolder = add.folder({ name: tempOptions.compFolder as string });
                                comp.parentFolder = newFolder;
                            }
                        }
                        if (tempOptions.returnAs === "comp" || tempOptions.returnAs === "comps") {
                            importedItems.push(comp);
                            continue;
                        }
                    }
                }

                importedItems.push(importedItem);
            }
        } catch (error: any) {
            $.writeln("Error importing file: " + error.message);
        }

        return importedItems;
    };

    private _sanitizeParams = (options: KT_ImportParams): KT_ImportOptions => {
        if (typeof options === "string") {
            options = { path: [options] };
        } else if (options instanceof Array) {
            options = { path: options };
        }
        options.path = typeof options.path === "string" ? [options.path] : options.path;

        const sanitizedOptions: KT_ImportOptions = {
            path: options.path || [],
            recursive: options.recursive || false,
            parent: options.parent,
            flat: options.flat !== undefined ? options.flat : true,
            importAs: options.importAs || undefined,
            toComp: options.toComp || false,
            asSequence: options.asSequence || false,
            footageFolder: options.footageFolder,
            compFolder: options.compFolder,
            importOptions: options.importOptions,
            returnAs: options.returnAs || "",
        };
        return sanitizedOptions;
    };

    private _parseImportOptions = (path: string, options: KT_ImportOptions): ImportOptions => {
        const filePath = KT_Path.sanitize(path);
        const file = new File(filePath);

        const importOptions: ImportOptions = options.importOptions || new ImportOptions();
        importOptions.file = file;

        let importAs: ImportAsType = ImportAsType.FOOTAGE;
        if ((options.importAs === "comp" || options.toComp) && importOptions.canImportAs(ImportAsType.COMP)) {
            importAs = ImportAsType.COMP;
        } else if (options.importAs === "project" && importOptions.canImportAs(ImportAsType.PROJECT)) {
            importAs = ImportAsType.PROJECT;
        } else if (
            options.importAs === "comp_cropped_layers" &&
            importOptions.canImportAs(ImportAsType.COMP_CROPPED_LAYERS)
        ) {
            importAs = ImportAsType.COMP_CROPPED_LAYERS;
        }

        importOptions.importAs = importAs;
        importOptions.sequence = options.importAs === "footage" ? true : false;
        importOptions.forceAlphabetical = true;
        importOptions.sequence = options.asSequence === true;
        return importOptions;
    };

    isValidExtension = (filePath: string | File, category?: string): boolean => {
        return KT_Path.isValidExtension(aeExtensions, filePath, category);
    };
}

export const KT_ProjectImport = new __KT_ProjectImport();
