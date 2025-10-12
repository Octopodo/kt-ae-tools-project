import { KT_Path as path } from "kt-io";
import { aeExtensions } from "./aeValidators";
export function KT_IsAeValidExtension(
    filePath: string | File,
    category?: string
): boolean {
    return path.isValidExtension(aeExtensions, filePath, category);
}
