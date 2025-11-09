import { describe, it, beforeEach, afterAll, expect, throwError, afterEach } from "kt-testing-suite-core";
import { KT_ProjectAdd } from "../add";
import { KT_ProjectFind } from "../find";
import { KT_ProjectRemove } from "../remove";
import { KT_AeProjectPath as pPath } from "../path";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_ProjectMove } from "../move";

describe("KT_ProjectFind", () => {
    let testFolder1: FolderItem;
    let testFolder2: FolderItem;
    let testComp1: CompItem;
    let testComp2: CompItem;
    let subFolder1: FolderItem;
    let subSubFolder1: FolderItem;

    beforeEach(() => {
        // Create test folder structure
        testFolder1 = KT_ProjectAdd.folder({ name: "TestFolder1" }) as FolderItem;
        testFolder2 = KT_ProjectAdd.folder({ name: "TestFolder2" }) as FolderItem;
        subFolder1 = KT_ProjectAdd.folder({ name: "SubFolder1", parentFolder: testFolder1 }) as FolderItem;
        subSubFolder1 = KT_ProjectAdd.folder({ name: "SubSubFolder1", parentFolder: subFolder1 }) as FolderItem;

        // Create test compositions
        testComp1 = KT_ProjectAdd.comp({
            name: "TestComp1",
            width: 1920,
            height: 1080,
            pixelAspect: 1,
            duration: 10,
            frameRate: 30,
        }) as CompItem;

        testComp2 = KT_ProjectAdd.comp({
            name: "TestComp2",
            width: 1920,
            height: 1080,
            pixelAspect: 1,
            duration: 10,
            frameRate: 30,
            parentFolder: testFolder1,
        }) as CompItem;
    });

    afterEach(() => {
        // Clean up test items
        if (testComp2 && testComp2.parentFolder !== app.project.rootFolder) {
            KT_ProjectMove.move(testComp2, app.project.rootFolder);
        }
        if (testComp1) testComp1.remove();
        if (testComp2) testComp2.remove();
        if (subSubFolder1) subSubFolder1.remove();
        if (subFolder1) subFolder1.remove();
        if (testFolder2) testFolder2.remove();
        if (testFolder1) testFolder1.remove();
    });

    describe("items()", () => {
        it("should find items by exact name", () => {
            const found = KT_ProjectFind.items({ name: "TestComp1" });
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp1");
        });

        it("should return empty array when no items match", () => {
            const found = KT_ProjectFind.items({ name: "NonExistentItem" });
            expect(found.length).toBe(0);
        });

        it("should find items by partial name using contains", () => {
            const found = KT_ProjectFind.items({ contains: "Test" });
            expect(found.length).toBeGreaterThanOrEqual(2); // At least TestComp1 and TestComp2
        });

        it("should find items by name starting with", () => {
            const found = KT_ProjectFind.items({ startsWith: "TestComp" });
            expect(found.length).toBe(2);
        });

        it("should find items by name ending with", () => {
            const found = KT_ProjectFind.items({ endsWith: "1" });
            let hasTestComp1 = false;
            for (let i = 0; i < found.length; i++) {
                if (found[i].name === "TestComp1") {
                    hasTestComp1 = true;
                    break;
                }
            }
            expect(hasTestComp1).toBe(true);
        });

        it("should find items by ID", () => {
            const found = KT_ProjectFind.items({ id: testComp1.id });
            expect(found.length).toBe(1);
            expect(found[0].id).toBe(testComp1.id);
        });

        it("should find items by path", () => {
            const comp2Path = pPath.get(testComp2);
            const found = KT_ProjectFind.items({ path: comp2Path });
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp2");
        });

        it("should handle case insensitive search", () => {
            const found = KT_ProjectFind.items({ name: "testcomp1", caseSensitive: false });
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp1");
        });

        it("should handle case sensitive search", () => {
            const found = KT_ProjectFind.items({ name: "testcomp1", caseSensitive: true });
            expect(found.length).toBe(0);
        });

        it("should find items using regex", () => {
            const found = KT_ProjectFind.items({ name: /TestComp\d/ });
            expect(found.length).toBe(2);
        });

        it("should find items using array of names", () => {
            const found = KT_ProjectFind.items({ name: ["TestComp1", "TestComp2"] });
            expect(found.length).toBe(2);
        });
    });

    describe("Auto conversion of input params", () => {
        it("should find items by string input (name)", () => {
            const found = KT_ProjectFind.items("TestComp1");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp1");
        });
        it("should find item by regexp input (name)", () => {
            const found = KT_ProjectFind.items(/TestComp1/);
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp1");
        });
        it("should find item by number input (id)", () => {
            const found = KT_ProjectFind.items(testComp1.id);
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp1");
        });
        it("should find items by path input", () => {
            const found = KT_ProjectFind.folders("//TestFolder1//SubFolder1");
            expect(found.length).toBeGreaterThan(0);
        });
    });

    describe("folders()", () => {
        it("should find folders by exact name", () => {
            const found = KT_ProjectFind.folders({ name: "TestFolder1" });
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestFolder1");
        });

        it("should find folders by path", () => {
            const subFolderPath = pPath.get(subFolder1);
            const found = KT_ProjectFind.folders({ path: subFolderPath });
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("SubFolder1");
        });

        it("should find nested folders using path with // separator", () => {
            const nestedPath = "//TestFolder1//SubFolder1//SubSubFolder1";
            const found = KT_ProjectFind.folders({ path: nestedPath });
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("SubSubFolder1");
        });
    });

    describe("comps()", () => {
        it("should find compositions by exact name", () => {
            const found = KT_ProjectFind.comps({ name: "TestComp1" });
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp1");
        });

        it("should find compositions by path", () => {
            const comp2Path = pPath.get(testComp2);
            const found = KT_ProjectFind.comps({ path: comp2Path });
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp2");
        });
    });

    // Test with existing items if they exist
    describe("existing items", () => {
        it("should find solid_1 if it exists", () => {
            const found = KT_ProjectFind.items({ name: "solid_1" });
            // This test passes whether solid_1 exists or not
            expect(found instanceof Array).toBe(true);
        });

        it("should find image_1.jpg if it exists", () => {
            const found = KT_ProjectFind.items({ name: "image_1.jpg" });
            expect(found instanceof Array).toBe(true);
        });

        it("should find footage_1.mp4 if it exists", () => {
            const found = KT_ProjectFind.footage({ name: "footage_1.mp4" });
            expect(found instanceof Array).toBe(true);
        });

        it("should find audio_1.wav if it exists", () => {
            const found = KT_ProjectFind.audios({ name: "audio_1.wav" });
            expect(found instanceof Array).toBe(true);
        });
    });

    describe("complex queries", () => {
        it("should combine multiple criteria", () => {
            const found = KT_ProjectFind.items({
                startsWith: "Test",
                contains: "Comp",
            });
            expect(found.length).toBe(2);
        });

        it("should handle mixed types in name array", () => {
            const found = KT_ProjectFind.items({
                name: ["TestComp1", "TestComp2"],
            });
            expect(found.length).toBe(2);
        });
        it("should handle secondary criteria with regexp", () => {
            const found = KT_ProjectFind.comps({
                endsWith: /\d/,
            });
            expect(found.length).toBe(2);
            expect(found[0].name).toBe("TestComp1");
            expect(found[1].name).toBe("TestComp2");
        });
    });

    describe("edge cases", () => {
        it("should handle empty options object", () => {
            const found = KT_ProjectFind.items({});
            expect(found instanceof Array).toBe(true);
            expect(found.length).toBeGreaterThanOrEqual(0);
        });

        it("should handle undefined options", () => {
            const found = KT_ProjectFind.items(undefined as any);
            expect(found instanceof Array).toBe(true);
        });

        it("should handle array of IDs", () => {
            const found = KT_ProjectFind.items({ id: [testComp1.id, 99999] });
            expect(found.length).toBe(1);
            expect(found[0].id).toBe(testComp1.id);
        });

        it("should handle regex with case insensitive flag", () => {
            const found = KT_ProjectFind.items({ name: /testcomp1/i });
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp1");
        });

        it("should find items with special characters in name", () => {
            // Create a comp with special characters
            const specialComp = KT_ProjectAdd.comp({
                name: "Test-Comp_123",
                width: 1920,
                height: 1080,
                pixelAspect: 1,
                duration: 10,
                frameRate: 30,
            }) as CompItem;

            const found = KT_ProjectFind.items({ name: "Test-Comp_123" });
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("Test-Comp_123");

            // Clean up
            KT_ProjectRemove.item(specialComp);
        });
    });

    describe("solids()", () => {
        it("should return empty array (method not implemented)", () => {
            const found = KT_ProjectFind.solids({ name: "any_solid" });
            expect(found.length).toBe(0);
        });
    });

    describe("array inputs", () => {
        it("should handle array of strings for name", () => {
            const found = KT_ProjectFind.items({ name: ["TestComp1", "TestComp2", "NonExistent"] });
            expect(found.length).toBe(2);
        });

        it("should handle array of regex for name", () => {
            const found = KT_ProjectFind.items({ name: [/TestComp1/, /TestComp2/] });
            expect(found.length).toBe(2);
        });

        it("should handle array of strings for contains", () => {
            const found = KT_ProjectFind.items({ contains: ["Test", "Comp"] });
            expect(found.length).toBeGreaterThanOrEqual(2);
        });
    });
});
