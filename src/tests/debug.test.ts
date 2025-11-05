import { describe, it, beforeEach, afterAll, expect, throwError, afterEach } from "kt-testing-suite-core";
import { KT_Project } from "../KT_Project";
import { KT_ProjectAdd } from "../add";
import { KT_ProjectFind } from "../find";
import { KT_ProjectRemove } from "../remove";
import { KT_AeProjectPath as pPath } from "../path";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_ProjectMove } from "../move";

describe("KT_Project.add Tests", () => {
    let createdItems: _ItemClasses[] = [];

    beforeEach(() => {
        createdItems = [];
    });

    afterEach(() => {
        for (const item of createdItems) {
            try {
                item.remove();
            } catch (e) {}
        }
    });
    it("should find by roor path (happy case)", () => {
        const comp = KT_ProjectAdd.comp({ name: "PathComp" });
        if (!is.comp(comp)) throwError("Path comp creation failed");
        createdItems.push(comp);
        const path = pPath.get(comp);
        const found = KT_ProjectFind.items(path);
        expect(found).toHaveLength(1);
        expect(found[0].name).toBe("PathComp");
    });

    it("should create a comp in a specified folder by path", () => {
        const folder = KT_Project.add.folder({ name: "Test Folder" });
        const comp = KT_Project.add.comp({
            name: "Test Comp",
            parentFolder: "//Test Folder",
        });
        if (!comp || !folder) throwError("Comp creation failed");
        createdItems.push(folder, comp);
        expect(comp).toBeTruthy();
        expect(comp.parentFolder).toBe(folder);
    });

    it("should create a folder inside another folder by path", () => {
        const parentFolder = KT_Project.add.folder({ name: "Parent Folder" });
        const childFolder = KT_Project.add.folder({
            name: "Child Folder",
            parentFolder: "//Parent Folder",
        });
        createdItems.push(parentFolder, childFolder);
        expect(childFolder).toBeTruthy();
        expect(childFolder.parentFolder).toBe(parentFolder);
    });
});
