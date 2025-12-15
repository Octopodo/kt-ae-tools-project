import { describe, it, beforeEach, afterAll, expect, throwError, afterEach } from "kt-testing-suite-core";
import { KT_ProjectAdd } from "../add";
import { KT_ProjectFind } from "../find";
import { KT_ProjectRemove } from "../remove";
import { KT_AeProjectPath as pPath } from "../path";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_ProjectMove } from "../move";
import { KT_AeLazyCache } from "../lazyCache";

describe("KT_ProjectFind", () => {
    let testFolder1: FolderItem;
    let testFolder2: FolderItem;
    let testComp1: CompItem;
    let testComp2: CompItem;
    let subFolder1: FolderItem;
    let subSubFolder1: FolderItem;
    let startTime: number;
    let endTime: number;
    const KT_LazyCache = new KT_AeLazyCache();

    beforeEach(() => {
        // Ensure cache is fresh to avoid stale objects from previous tests
        KT_LazyCache.refresh();

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
        startTime = new Date().getTime();
    });

    afterEach(() => {
        // Clean up test items
        if (testComp2 && testComp2.parentFolder !== app.project.rootFolder) {
            KT_ProjectMove.move(testComp2, app.project.rootFolder);
        }
        if (testComp1) KT_ProjectRemove.item(testComp1);
        if (testComp2) KT_ProjectRemove.item(testComp2);
        if (subSubFolder1) KT_ProjectRemove.folder(subSubFolder1);
        if (subFolder1) KT_ProjectRemove.folder(subFolder1);
        if (testFolder2) KT_ProjectRemove.folder(testFolder2);
        if (testFolder1) KT_ProjectRemove.folder(testFolder1);

        endTime = new Date().getTime();
        $.writeln("    ⏰Test performance: " + (endTime - startTime) + " ms");
    });

    describe("items()", () => {
        it("should find items by exact name", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ name: "TestComp1" });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp1");
        });

        it("should return empty array when no items match", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ name: "NonExistentItem" });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(0);
        });

        it("should find items by partial name using contains", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ contains: "Test" });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBeGreaterThanOrEqual(2); // At least TestComp1 and TestComp2
        });

        it("should find items by name starting with", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ startsWith: "TestComp" });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(2);
        });

        it("should find items by name ending with", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ endsWith: "1" });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
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
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ id: testComp1.id });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].id).toBe(testComp1.id);
        });

        it("should find items by path", () => {
            const sTime = new Date().getTime();
            const comp2Path = pPath.get(testComp2);
            const found = KT_ProjectFind.items({ path: comp2Path });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp2");
        });

        it("should find items by relative path", () => {
            const sTime = new Date().getTime();
            const comp2RelPath = pPath.getParentPath(pPath.get(testComp2));
            const found = KT_ProjectFind.items({ name: testComp2.name, relativePath: comp2RelPath });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp2");
        });

        it("should handle case insensitive search", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ name: "testcomp1", caseSensitive: false });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp1");
        });

        it("should handle case sensitive search", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ name: "testcomp1", caseSensitive: true });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(0);
        });

        it("should find items using regex", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ name: /TestComp\d/ });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(2);
        });

        it("should find items using array of names", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ name: ["TestComp1", "TestComp2"] });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(2);
        });
    });

    describe("Auto conversion of input params", () => {
        it("should find items by string input (name)", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items("TestComp1");
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp1");
        });
        it("should find item by regexp input (name)", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items(/TestComp1/);
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp1");
        });
        it("should find item by number input (id)", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items(testComp1.id);
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp1");
        });
        it("should find items by path input", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.folders("//TestFolder1//SubFolder1");
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBeGreaterThan(0);
        });
    });

    describe("folders()", () => {
        it("should find folders by exact name", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.folders({ name: "TestFolder1" });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestFolder1");
        });

        it("should find folders by path", () => {
            const sTime = new Date().getTime();
            const subFolderPath = pPath.get(subFolder1);
            const found = KT_ProjectFind.folders({ path: subFolderPath });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("SubFolder1");
        });

        it("should find nested folders using path with // separator", () => {
            const sTime = new Date().getTime();
            const nestedPath = "//TestFolder1//SubFolder1//SubSubFolder1";
            const found = KT_ProjectFind.folders({ path: nestedPath });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("SubSubFolder1");
        });
    });

    describe("comps()", () => {
        it("should find compositions by exact name", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.comps({ name: "TestComp1" });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp1");
        });

        it("should find compositions by path", () => {
            const sTime = new Date().getTime();
            const comp2Path = pPath.get(testComp2);
            const found = KT_ProjectFind.comps({ path: comp2Path });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp2");
        });
    });

    // Test with existing items if they exist
    describe("existing items", () => {
        it("should find solid_1 if it exists", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ name: "solid_1" });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            // This test passes whether solid_1 exists or not
            expect(found instanceof Array).toBe(true);
        });

        it("should find image_1.jpg if it exists", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ name: "image_1.jpg" });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found instanceof Array).toBe(true);
        });

        it("should find footage_1.mp4 if it exists", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.footage({ name: "footage_1.mp4" });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found instanceof Array).toBe(true);
        });

        it("should find audio_1.wav if it exists", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.audios({ name: "audio_1.wav" });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found instanceof Array).toBe(true);
        });
    });

    describe("complex queries", () => {
        it("should combine multiple criteria", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({
                startsWith: "Test",
                contains: "Comp",
            });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(2);
        });

        it("should handle mixed types in name array", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({
                name: ["TestComp1", "TestComp2"],
            });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(2);
        });
        it("should handle secondary criteria with regexp", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.comps({
                endsWith: /\d/,
            });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(2);
            expect(found[0].name).toBe("TestComp1");
            expect(found[1].name).toBe("TestComp2");
        });
    });

    describe("edge cases", () => {
        it("should handle empty options object", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({});
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found instanceof Array).toBe(true);
            expect(found.length).toBeGreaterThanOrEqual(0);
        });

        it("should handle undefined options", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items(undefined as any);
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found instanceof Array).toBe(true);
        });

        it("should handle array of IDs", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ id: [testComp1.id, 99999] });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].id).toBe(testComp1.id);
        });

        it("should handle regex with case insensitive flag", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ name: /testcomp1/i });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
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
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ name: "Test-Comp_123" });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("Test-Comp_123");

            // Clean up
            KT_ProjectRemove.item(specialComp);
        });
    });

    describe("solids()", () => {
        it("should return empty array (method not implemented)", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.solids({ name: "any_solid" });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(0);
        });
    });

    describe("array inputs", () => {
        it("should handle array of strings for name", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ name: ["TestComp1", "TestComp2", "NonExistent"] });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(2);
        });

        it("should handle array of regex for name", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ name: [/TestComp1/, /TestComp2/] });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(2);
        });

        it("should handle array of strings for contains", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({ contains: ["Test", "Comp"] });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe("check function", () => {
        it("should find items using custom check function", () => {
            const compToMatch = KT_ProjectAdd.comp({
                name: "CustomCheckComp",
                width: 200,
                height: 200,
            }) as CompItem;

            const standardComp = KT_ProjectAdd.comp({
                name: "StandardComp",
                width: 1920,
                height: 1080,
            }) as CompItem;

            expect(is.comp(compToMatch)).toBe(true);
            expect(is.comp(standardComp)).toBe(true);
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.comps({
                check: (item: _ItemClasses) => {
                    const comp = item as CompItem;
                    return comp.width < 500 && comp.height < 500;
                },
            });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("CustomCheckComp");
            // Clean up
            KT_ProjectRemove.item(compToMatch);
            KT_ProjectRemove.item(standardComp);
        });

        it("should perform callback on each found item", () => {
            const namesFound: string[] = [];
            const sTime = new Date().getTime();
            KT_ProjectFind.items({
                startsWith: "TestComp",
                callback: (item: _ItemClasses) => {
                    namesFound.push(item.name);
                },
            });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            namesFound.forEach((name) => {
                $.writeln("Found item via callback: " + name);
            });
            expect(namesFound.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe("root folder restriction", () => {
        it("should find items only within specified root folder", () => {
            const sTime = new Date().getTime();
            const found = KT_ProjectFind.items({
                root: testFolder1,
                startsWith: "TestComp",
            });
            const eTime = new Date().getTime();
            $.writeln("    ⏱️ Search performance: " + (eTime - sTime) + " ms");
            expect(found.length).toBe(1);
            expect(found[0].name).toBe("TestComp2");
        });
    });
});
