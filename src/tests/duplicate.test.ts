import {
    describe,
    it,
    expect,
    runTests,
    beforeEach,
    afterEach,
} from "kt-testing-suite-core";
import { KT_Project } from "../index";

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
        createdItems.push(comp);

        const dup = KT_Project.duplicate.comp(comp);
        expect(dup).toBeTruthy();
        if (dup) {
            createdItems.push(dup as CompItem);
            expect((dup as CompItem).name).toBe("Duplicate Comp copy");
            expect(dup instanceof CompItem).toBe(true);
        }
    });

    it("should duplicate a folder", () => {
        const folder = KT_Project.add.folder({ name: "Duplicate Folder" });
        createdItems.push(folder);

        const dup = KT_Project.duplicate.folder(folder);
        expect(dup).toBeTruthy();
        if (dup) {
            createdItems.push(dup as FolderItem);
            expect((dup as FolderItem).name).toBe("Duplicate Folder copy");
            expect(dup instanceof FolderItem).toBe(true);
        }
    });

    it("should duplicate by path", () => {
        const comp = KT_Project.add.comp({ name: "Duplicate By Path" });
        createdItems.push(comp);

        const dup = KT_Project.duplicate.comp("//Duplicate By Path");
        expect(dup).toBeTruthy();
        if (dup) {
            createdItems.push(dup as CompItem);
            expect((dup as CompItem).name).toBe("Duplicate By Path copy");
        }
    });
});

runTests();
