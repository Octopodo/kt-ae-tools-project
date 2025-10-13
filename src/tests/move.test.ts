import { describe, it, expect, runTests, beforeEach, afterEach, throwError } from "kt-testing-suite-core";
import { KT_Project } from "../index";

describe("KT_Project.move Tests", () => {
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

    it("should move a comp to a folder by path", () => {
        const comp = KT_Project.add.comp({ name: "Test Comp" });
        const folder = KT_Project.add.folder({ name: "Test Folder" });
        if (!comp) throwError("Comp creation failed");
        createdItems.push(comp, folder);
        expect(comp).toBeTruthy();
        expect(folder).toBeTruthy();

        const result = KT_Project.move.move("//Test Comp", "//Test Folder");
        expect(result).toBe(true);

        const movedComp = KT_Project.find.comps({ name: "Test Comp" });
        expect(movedComp).toBeTruthy();
        expect((movedComp as CompItem[])[0].parentFolder).toBe(folder);
    });

    it("should move multiple items to a folder", () => {
        const comp1 = KT_Project.add.comp({ name: "Comp1" });
        const comp2 = KT_Project.add.comp({ name: "Comp2" });
        const folder = KT_Project.add.folder({ name: "Dest Folder" });
        if (!comp1 || !comp2) throwError("Comp creation failed");
        createdItems.push(comp1, comp2, folder);

        const result = KT_Project.move.move([comp1, comp2], folder);
        expect(result).toBe(true);

        const found1 = KT_Project.find.comps({ name: "Comp1" });
        const found2 = KT_Project.find.comps({ name: "Comp2" });
        expect((found1 as CompItem[])[0].parentFolder).toBe(folder);
        expect((found2 as CompItem[])[0].parentFolder).toBe(folder);
    });

    it("should return false for invalid paths", () => {
        const result = KT_Project.move.move("//NonExistent", "//AlsoNonExistent");
        expect(result).toBe(false);
    });
});
