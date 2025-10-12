import {
    describe,
    it,
    expect,
    runTests,
    beforeEach,
    afterEach,
} from "kt-testing-suite-core";
import { KT_Project } from "../index";
import { KT_AeProjectPath } from "../path";

describe("KT_Project.find Tests", () => {
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

    it("should find an item by name", () => {
        const comp = KT_Project.add.comp({ name: "Find Comp" });
        createdItems.push(comp);
        const found = KT_Project.find.item({ name: "Find Comp" });
        expect(found).toBeTruthy();
        expect((found as _ItemClasses[])[0]).toBe(comp);
    });

    it("should find an item by id", () => {
        const comp = KT_Project.add.comp({ name: "Find Comp ID" });
        createdItems.push(comp);
        const found = KT_Project.find.item({ id: comp.id });
        expect(found).toBeTruthy();
        expect((found as _ItemClasses[])[0]).toBe(comp);
    });

    it("should find an item by path", () => {
        const comp = KT_Project.add.comp({ name: "Find Comp Path" });
        createdItems.push(comp);
        const path = KT_AeProjectPath.get(comp);
        const found = KT_Project.find.item({ path: path });
        expect(found).toBeTruthy();
        expect((found as _ItemClasses[])[0]).toBe(comp);
    });

    it("should find a folder by name", () => {
        const folder = KT_Project.add.folder({ name: "Find Folder" });
        createdItems.push(folder);
        const found = KT_Project.find.folder({ name: "Find Folder" });
        expect(found).toBe(folder);
    });

    it("should find comps", () => {
        const comp1 = KT_Project.add.comp({ name: "Comp1" });
        const comp2 = KT_Project.add.comp({ name: "Comp2" });
        createdItems.push(comp1, comp2);
        const found = KT_Project.find.comp({});
        expect(found).toBeTruthy();
        expect((found as CompItem[]).length).toBeGreaterThanOrEqual(2);
    });

    it("should find footage", () => {
        const found = KT_Project.find.footage({});
        expect(found === false || found instanceof Array).toBe(true);
        if (found !== false) {
            expect((found as FootageItem[]).length).toBeGreaterThan(0);
        }
    });

    it("should find audio", () => {
        const found = KT_Project.find.audio({});
        expect(found === false || found instanceof Array).toBe(true);
        if (found !== false) {
            expect((found as FootageItem[]).length).toBeGreaterThan(0);
        }
    });

    it("should find video", () => {
        const found = KT_Project.find.video({});
        expect(found === false || found instanceof Array).toBe(true);
        if (found !== false) {
            expect((found as FootageItem[]).length).toBeGreaterThan(0);
        }
    });

    it("should find images", () => {
        const found = KT_Project.find.image({});
        expect(found === false || found instanceof Array).toBe(true);
        if (found !== false) {
            expect((found as FootageItem[]).length).toBeGreaterThan(0);
        }
    });

    it("should find solids", () => {
        const found = KT_Project.find.solid({});
        expect(found === false || found instanceof Array).toBe(true);
        if (found !== false) {
            expect((found as _ItemClasses[]).length).toBeGreaterThan(0);
        }
    });
});
