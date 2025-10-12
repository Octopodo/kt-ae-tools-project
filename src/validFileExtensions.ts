import { KT_Path as path } from "kt-io";

let _extensionToTypeLookup: Record<string, string[]> = {};

function KT_IsValidExtension(
    filePath: string | File,
    category: string
): boolean {
    const file =
        typeof filePath === "string"
            ? new File(path.sanitize(filePath))
            : filePath;
    const ext = path.getFileExtension(file.name).toLowerCase();
    if (!ext) return false;

    const types = _extensionToTypeLookup[ext];
    if (!types) return false;

    for (var i = 0; i < types.length; i++) {
        if (types[i] === category) return true;
    }
    return false;
}
