import { describe, it, expect, runTests, beforeEach, afterEach, throwError } from "kt-testing-suite-core";
import { AE } from "kt-testing-suite-ae";
import { KT_Project } from "../index";
import { KT_AeIs as is } from "kt-ae-is-checkers";

describe("KT_Project.duplicate Tests", () => {
    let createdItems: _ItemClasses[] = [];

    beforeEach(() => {
        createdItems = [];
    });

    afterEach(() => {
        // Clean up created items
        for (const item of createdItems) {
            try {
                item.remove();
            } catch (e) {}
        }
        createdItems = [];
    });

    it("should duplicate a comp", () => {
        const comp = KT_Project.add.comp({ name: "Duplicate Comp" });
        if (!comp) throw new Error("Comp creation failed");
        createdItems.push(comp);

        const dup = KT_Project.duplicate.comps(comp);
        expect(dup).toBeArray();
        expect(dup.length).toBeGreaterThan(0);
        if (dup) {
            createdItems.push(dup[0] as CompItem);
            expect((dup[0] as CompItem).name).toBe("Duplicate Comp 2");
            expect(is.comp(dup[0])).toBe(true);
        }
    });

    it("should duplicate a folder", () => {
        const folder = KT_Project.add.folder({ name: "Duplicate Folder" });
        createdItems.push(folder);

        const dup = KT_Project.duplicate.folders(folder);
        expect(dup).toBeTruthy();
        expect(dup.length).toBeGreaterThan(0);
        if (dup[0]) {
            createdItems.push(dup[0] as FolderItem);
            expect((dup[0] as FolderItem).name).toBe("Duplicate Folder copy");
            expect(is.folder(dup[0])).toBe(true);
        }
    });

    it("should duplicate by path", () => {
        const comp = KT_Project.add.comp({ name: "Duplicate By Path" });
        if (!comp) throw new Error("Comp creation failed");
        createdItems.push(comp);
        const compPath = KT_Project.path.get(comp);
        const dup = KT_Project.duplicate.comps(compPath);
        expect(dup).toBeArray();
        expect(dup.length).toBeGreaterThan(0);
        if (dup[0]) {
            createdItems.push(dup[0] as CompItem);
            expect((dup[0] as CompItem).name).toBe("Duplicate By Path 2");
        }
    });

    it("should duplicate entire folder contents", () => {
        const folder = KT_Project.add.folder({ name: "Folder To Duplicate" });
        const comp1 = KT_Project.add.comp({
            name: "Comp In Folder 1",
            parentFolder: folder,
        });
        const comp2 = KT_Project.add.comp({
            name: "Comp In Folder 2",
            parentFolder: folder,
        });
        const subFolder = KT_Project.add.folder({ name: "Subfolder", parentFolder: folder });
        const subComp = KT_Project.add.comp({
            name: "Comp In Subfolder",
            parentFolder: subFolder,
        });
        if (!comp1 || !comp2 || !subComp) throwError("Comp creation failed");
        createdItems.push(folder, comp1, comp2, subFolder, subComp);

        const dup = KT_Project.duplicate.folders(folder);
        expect(dup).toBeArray();
        expect(dup.length).toBeGreaterThan(0);
        //check contents
        const dupFolder = dup[0] as FolderItem;
        createdItems.push(dupFolder);
        const dupComp1 = KT_Project.find.comps({
            
    });
});

