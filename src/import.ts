import { KT_Path as path } from "kt-io";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_ProjectAdd as add } from "./add";
import { aeExtensions } from ".//aeExtensionValidators";

type KT_ImportOptions = {
    path: string; // Path on disk to import from
    recursive?: boolean; // Whether to import folders recursively
    parent?: FolderItem | string; // Parent folder in the project to import into
    renameDuplicates?: boolean; // Whether to rename duplicates
    importAs?: string; // Force import as a specific type: "footage", "comp", "folder"
    toComp?: Boolean; // Whether to import footage as a new comp
    asSequence?: Boolean; // Whether to import footage as a sequence
    footageFolder?: FolderItem | string; // Folder to import footage into
    compFolder?: FolderItem | string; // Folder to import comps into. Only used if importAs is "comp" or toComp is true
    importOptions?: ImportOptions; // Additional import options passed to app.project.importFile
};

class __KT_ProjectImport {
    private _folderRecursive = (options: KT_ImportOptions): FolderItem | Boolean => {
        return false;
    };

    private _parseImportOptions = (options: KT_ImportOptions): ImportOptions | false => {
        if (!options || typeof options.path !== "string") {
            return false;
        }
        const filePath = path.sanitize(options.path);
        const file = new File(filePath);

        if (!file.exists) {
            return false;
        }

        const importOptions: ImportOptions = options.importOptions || new ImportOptions();
        let importAs: ImportAsType = ImportAsType.FOOTAGE;
        if (options.importAs === "comp" || options.toComp) {
            importAs = ImportAsType.COMP;
        } else if (options.importAs === "project") {
            importAs = ImportAsType.PROJECT;
        } else if (options.importAs === "comp_cropped_layers") {
            importAs = ImportAsType.COMP_CROPPED_LAYERS;
        }

        importOptions.file = file;
        importOptions.importAs = importAs;
        importOptions.sequence = options.importAs === "footage" ? true : false;
        importOptions.forceAlphabetical = true;
        importOptions.sequence = options.asSequence === true;
        return importOptions;
    };

    private _importFile = (
        options: KT_ImportOptions,
        fileChecker: (file: File | string) => boolean = (file) => true
    ): _ItemClasses | Boolean => {
        const importOptions = this._parseImportOptions(options);
        if (!importOptions || !importOptions.canImportAs(importOptions.importAs)) {
            return false;
        }
        try {
            if (!fileChecker(importOptions.file)) {
                return false;
            }
            const importedItem = app.project.importFile(importOptions);
        } catch (error: any) {
            $.writeln("Error importing file: " + error.message);
        }

        return false;
    };

    isValidExtension = (filePath: string | File, category?: string): boolean => {
        return path.isValidExtension(aeExtensions, filePath, category);
    };

    folder = (options: KT_ImportOptions): FolderItem | Boolean => {
        return false;
    };

    file = (options: KT_ImportOptions): _ItemClasses | Boolean => {
        return this._importFile(options, (file) => this.isValidExtension(file));
    };

    audio = (options: KT_ImportOptions): _ItemClasses | Boolean => {
        const imported = this._importFile(options, (file) => this.isValidExtension(file, "audio"));

        return imported;
    };

    video = (options: KT_ImportOptions): _ItemClasses | Boolean => {
        const imported = this._importFile(options, (file) => this.isValidExtension(file, "video"));
        return imported;
    };

    image = (options: KT_ImportOptions): _ItemClasses | Boolean => {
        const imported = this._importFile(options, (file) => this.isValidExtension(file, "image"));
        return imported;
    };

    footage = (options: KT_ImportOptions): _ItemClasses | Boolean => {
        const imported = this._importFile(
            options,
            (file) =>
                this.isValidExtension(file, "image") ||
                this.isValidExtension(file, "video") ||
                this.isValidExtension(file, "audio")
        );
        return imported;
    };
}

export const KT_ProjectImport = new __KT_ProjectImport();
