import { describe, it, expect, runTests, beforeEach, afterEach, throwError } from "kt-testing-suite-core";

import { KT_Project } from "../index";

describe("KT_AeProjectPath Tests", () => {
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

    it("should get path of a root item", () => {
        const comp = KT_Project.add.comp({ name: "Path Comp" });
        if (!comp) throwError("Comp creation failed");
        createdItems.push(comp);
        const path = KT_Project.path.get(comp);
        expect(path).toBe("//Path Comp");
    });

    it("should get path of a nested item", () => {
        const folder = KT_Project.add.folder({ name: "Parent" });
        const comp = KT_Project.add.comp({
            name: "Child Comp",
            parentFolder: folder,
        });
        if (!comp) throwError("Comp creation failed");
        createdItems.push(folder, comp);
        const path = KT_Project.path.get(comp);
        expect(path).toBe("//Parent//Child Comp");
    });

    it("should join paths", () => {
        const joined = KT_Project.path.join("Parent", "Child");
        expect(joined).toBe("Parent//Child");
    });

    it("should parse a path", () => {
        const parsed = KT_Project.path.parse("//Parent//Child");
        expect(parsed).toEqual(["Parent", "Child"]);
    });

    it("should resolve a path to an item", () => {
        const comp = KT_Project.add.comp({ name: "Resolve Comp" });
        if (!comp) throwError("Comp creation failed");
        createdItems.push(comp);
        const resolved = KT_Project.path.resolve(app.project.rootFolder, "//Resolve Comp");
        expect(resolved).toBe(comp);
    });

    it("should return null for invalid path", () => {
        const resolved = KT_Project.path.resolve(app.project.rootFolder, "//Invalid");
        expect(resolved).toBe(null);
    });

    it("should get parent path", () => {
        const parent = KT_Project.path.getParent("//Parent//Child");
        expect(parent).toBe("//Parent");
    });

    it("should get name from path", () => {
        const name = KT_Project.path.getName("//Parent//Child");
        expect(name).toBe("Child");
    });

    it("should check if path is absolute", () => {
        expect(KT_Project.path.isAbsolute("//Path")).toBe(true);
        expect(KT_Project.path.isAbsolute("Path")).toBe(false);
    });

    it("should normalize path", () => {
        const normalized = KT_Project.path.normalize("Parent//Child");
        expect(normalized).toBe("//Parent//Child");
    });

    it("should get item by path", () => {
        const comp = KT_Project.add.comp({ name: "Get Item Comp" });
        if (!comp) throwError("Comp creation failed");
        createdItems.push(comp);
        const item = KT_Project.path.getItem("//Get Item Comp");
        expect(item).toBe(comp);
    });
});
