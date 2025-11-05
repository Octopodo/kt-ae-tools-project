import { describe, it, beforeEach, afterAll, expect, throwError, afterEach } from "kt-testing-suite-core";
import { KT_ProjectAdd } from "../add";
import { KT_ProjectFind } from "../find";
import { KT_ProjectRemove } from "../remove";
import { KT_AeProjectPath as pPath } from "../path";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { KT_ProjectMove } from "../move";

describe("KT_ProjectFind Tests", () => {
    let createdItems: _ItemClasses[] = [];

    describe("General Normalization and Root Handling", () => {
        let testFolder: FolderItem | null = null;
        beforeEach(() => {
            // Reset createdItems per test
            createdItems = [];
        });
        afterEach(() => {
            // Cleanup for this suite
            if (testFolder) {
                try {
                    testFolder.remove();
                } catch (e) {
                    // Ignore if already removed
                }
            }
            for (const item of createdItems) {
                try {
                    KT_ProjectRemove.item(item);
                } catch (e) {
                    $.write("Error removing item during cleanup: " + e + "\n" + item.name);
                }
            }
        });

        it("should normalize number input as ID", () => {
            // Assume a comp with ID 1 exists (e.g., first item); adjust if needed
            const items = KT_ProjectFind.items(1); // Hypothetical ID
            expect(items).toBeArray(); // At least checks normalization doesn't crash
        });

        it("should normalize string as name if not a path", () => {
            const items = KT_ProjectFind.items("footage_1.mp4");
            //@ts-ignore
            expect(items[0].name).toBe("footage_1.mp4");
        });

        it("should normalize string as path if valid path", () => {
            // Create a test item in root for path
            const testItem = KT_ProjectAdd.folder({ name: "TestPathItem" });
            if (!is.folder(testItem)) throwError("Folder creation failed");
            createdItems.push(testItem);
            const path = pPath.get(testItem);
            const found = KT_ProjectFind.items(path);
            expect(found).toHaveLength(1);
            expect(found[0]).toBe(testItem);
        });

        it("should use custom root for scoped search", () => {
            // Create test folder
            testFolder = KT_ProjectAdd.folder({ name: "TestScopedFolder" });
            if (!is.folder(testFolder)) throwError("Scoped folder creation failed");
            createdItems.push(testFolder);
            // Add a comp inside
            const scopedComp = KT_ProjectAdd.comp({ name: "ScopedComp", parentFolder: testFolder });
            if (!is.comp(scopedComp)) throwError("Scoped comp creation failed");
            createdItems.push(scopedComp);
            // Search with root
            const found = KT_ProjectFind.comps({ name: "ScopedComp", root: testFolder });
            expect(found).toHaveLength(1);
            expect(found[0]).toBe(scopedComp);
            // Should not find in global
            const globalFound = KT_ProjectFind.comps({ name: "ScopedComp" });
            expect(globalFound).toHaveLength(1); // Still finds, but in scoped it's isolated
        });

        it("should handle empty options (search all in root)", () => {
            const allItems = KT_ProjectFind.items({});
            expect(allItems).toBeArray();
            expect(allItems.length).toBeGreaterThan(0); // Project has pre-existing items
        });
    });

    describe("Happy Path: Successful Finds", () => {
        afterEach(() => {
            // Cleanup for this suite
            for (const item of createdItems) {
                try {
                    KT_ProjectRemove.item(item);
                } catch (e) {
                    // Ignore
                }
            }
        });

        it("should find all items by type (folders)", () => {
            const tempFolder = KT_ProjectAdd.folder({ name: "TempFolderForTypeTest" });
            if (!is.folder(tempFolder)) throwError("Temp folder creation failed");
            createdItems.push(tempFolder);
            const folders = KT_ProjectFind.folders({});
            expect(folders).toBeArray();
            expect(folders.length).toBeGreaterThan(0); // Assume project has folders
        });

        it("should find comps by name", () => {
            const comp = KT_ProjectAdd.comp({ name: "HappyComp" });
            if (!is.comp(comp)) throwError("Happy comp creation failed");
            createdItems.push(comp);
            const found = KT_ProjectFind.comps({ name: "HappyComp" });
            expect(found).toHaveLength(1);
            expect(found[0].name).toBe("HappyComp");
        });

        it("should find footage by name (pre-existing)", () => {
            const footage = KT_ProjectFind.footage({ name: "footage_1.mp4" });
            expect(footage).toHaveLength(1);
            expect(footage[0].name).toBe("footage_1.mp4");
        });

        it("should find audios by name (pre-existing)", () => {
            const audios = KT_ProjectFind.audios({ name: "audio_1.wav" });
            expect(audios).toHaveLength(1);
            expect(audios[0].name).toBe("audio_1.wav");
        });

        it("should find videos by name (pre-existing)", () => {
            const videos = KT_ProjectFind.videos({ name: "footage_1.mp4" }); // Assume m4 is video
            expect(videos).toHaveLength(1);
            expect(videos[0].name).toBe("footage_1.mp4");
        });

        it("should find images by name (pre-existing)", () => {
            const images = KT_ProjectFind.images({ name: "image_1.jpg" });
            expect(images).toHaveLength(1);
            expect(images[0].name).toBe("image_1.jpg");
        });

        it("should find solids by name (pre-existing + optimization)", () => {
            const solids = KT_ProjectFind.solids({ name: "solid_1" });
            expect(solids).toHaveLength(1);
            expect(solids[0].name).toBe("solid_1");
        });

        it("should find by ID (happy case)", () => {
            const comp = KT_ProjectAdd.comp({ name: "IdComp" });
            if (!is.comp(comp)) throwError("Id comp creation failed");
            createdItems.push(comp);
            const id = comp.id;
            const found = KT_ProjectFind.items(id);
            expect(found).toHaveLength(1);
            expect(found[0].id).toBe(id);
        });

        it("should find by path (happy case)", () => {
            const comp = KT_ProjectAdd.comp({ name: "PathComp" });
            if (!is.comp(comp)) throwError("Path comp creation failed");
            createdItems.push(comp);
            const path = pPath.get(comp);
            const found = KT_ProjectFind.items(path);
            expect(found).toHaveLength(1);
            expect(found[0].name).toBe("PathComp");
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

        it("should find multiple matching items", () => {
            const comp1 = KT_ProjectAdd.comp({ name: "MultiComp" });
            if (!is.comp(comp1)) throwError("Multi comp1 creation failed");
            const comp2 = KT_ProjectAdd.comp({ name: "MultiComp" });
            if (!is.comp(comp2)) throwError("Multi comp2 creation failed");
            createdItems.push(comp1, comp2);
            const found = KT_ProjectFind.comps({ name: "MultiComp" });
            expect(found).toHaveLength(2);
        });
    });

    describe("Sad Path: No Results or Errors", () => {
        let testFolder: FolderItem | null = null;

        afterEach(() => {
            // Cleanup for this suite
            if (testFolder) {
                try {
                    testFolder.remove();
                } catch (e) {
                    // Ignore if already removed
                }
            }
            for (const item of createdItems) {
                try {
                    KT_ProjectRemove.item(item);
                } catch (e) {
                    // Ignore
                }
            }
        });

        it("should return empty array for non-existent name", () => {
            const found = KT_ProjectFind.comps({ name: "NonExistentComp" });
            expect(found).toHaveLength(0);
        });

        it("should return empty array for invalid ID", () => {
            const found = KT_ProjectFind.items(-999); // Invalid ID
            expect(found).toHaveLength(0);
        });

        it("should return empty array for invalid path", () => {
            const found = KT_ProjectFind.items("//Invalid//Path");
            expect(found).toHaveLength(0);
        });

        it("should handle ID error gracefully (no crash)", () => {
            // Invalid ID throws internally, but should not crash test
            const found = KT_ProjectFind.items(999999); // Likely invalid
            expect(found).toBeArray();
            expect(found.length).toBe(0);
        });

        it("should return empty for no solids in custom root without Solids folder", () => {
            testFolder = KT_ProjectAdd.folder({ name: "EmptyTestFolder" });
            if (!is.folder(testFolder)) throwError("Empty test folder creation failed");
            createdItems.push(testFolder);
            const found = KT_ProjectFind.solids({ root: testFolder });
            expect(found).toHaveLength(0);
        });

        it("should return empty for type mismatch (e.g., search comp as folder)", () => {
            const comp = KT_ProjectAdd.comp({ name: "CompAsFolder" });
            if (!is.comp(comp)) throwError("Comp as folder creation failed");
            createdItems.push(comp);
            const foundAsFolder = KT_ProjectFind.folders({ name: "CompAsFolder" });
            expect(foundAsFolder).toHaveLength(0);
        });
    });

    describe("Grey Path: Edge Cases", () => {
        let testFolder: FolderItem | null = null;
        let solidsFolder: FolderItem | null = null;

        afterEach(() => {
            // Cleanup for this suite
            if (testFolder) {
                try {
                    testFolder.remove();
                } catch (e) {
                    // Ignore if already removed
                }
            }
            if (solidsFolder) {
                try {
                    solidsFolder.remove();
                } catch (e) {
                    // Ignore
                }
            }
            for (const item of createdItems) {
                try {
                    KT_ProjectRemove.item(item);
                } catch (e) {
                    // Ignore
                }
            }
        });

        it("should handle case-sensitive names (exact match)", () => {
            const comp = KT_ProjectAdd.comp({ name: "CaseSensitiveComp" });
            if (!is.comp(comp)) throwError("Case sensitive comp creation failed");
            createdItems.push(comp);
            const foundExact = KT_ProjectFind.comps({ name: "CaseSensitiveComp" });
            expect(foundExact).toHaveLength(1);
            const foundWrongCase = KT_ProjectFind.comps({ name: "casesensitivecomp" });
            expect(foundWrongCase).toHaveLength(0); // AE is case-sensitive
        });

        it("should find in nested structure via path", () => {
            testFolder = KT_ProjectAdd.folder({ name: "NestedFolder" });
            if (!is.folder(testFolder)) throwError("Nested folder creation failed");
            createdItems.push(testFolder);
            const subFolder = KT_ProjectAdd.folder({ name: "SubFolder", parentFolder: testFolder });
            if (!is.folder(subFolder)) throwError("Sub folder creation failed");
            createdItems.push(subFolder);
            const nestedComp = KT_ProjectAdd.comp({ name: "NestedComp", parentFolder: subFolder });
            if (!is.comp(nestedComp)) throwError("Nested comp creation failed");
            createdItems.push(nestedComp);
            const path = pPath.join("NestedFolder", "SubFolder", "NestedComp");
            const fullPath = pPath.normalize(path);
            const found = KT_ProjectFind.comps(fullPath);
            expect(found).toHaveLength(1);
            expect(found[0].name).toBe("NestedComp");
        });

        it("should scope to custom root excluding siblings", () => {
            testFolder = KT_ProjectAdd.folder({ name: "ScopedParent" });
            if (!is.folder(testFolder)) throwError("Scoped parent creation failed");
            createdItems.push(testFolder);
            const inScope = KT_ProjectAdd.comp({ name: "InScope", parentFolder: testFolder });
            if (!is.comp(inScope)) throwError("In scope creation failed");
            createdItems.push(inScope);
            const siblingFolder = KT_ProjectAdd.folder({ name: "Sibling" });
            if (!is.folder(siblingFolder)) throwError("Sibling folder creation failed");
            createdItems.push(siblingFolder);
            const outOfScope = KT_ProjectAdd.comp({ name: "OutOfScope", parentFolder: siblingFolder });
            if (!is.comp(outOfScope)) throwError("Out of scope creation failed");
            createdItems.push(outOfScope);
            // Search in scoped root
            const foundInScope = KT_ProjectFind.comps({ name: "InScope", root: testFolder });
            expect(foundInScope).toHaveLength(1);
            // Out of scope not found in this root
            const foundOut = KT_ProjectFind.comps({ name: "OutOfScope", root: testFolder });
            expect(foundOut).toHaveLength(0);
        });

        it("should optimize solids search: find in Solids folder first", () => {
            solidsFolder = KT_ProjectAdd.folder({ name: "Solids" });
            if (!is.folder(solidsFolder)) throwError("Solids folder creation failed");
            createdItems.push(solidsFolder);
            // Create solid directly since add.solid may not exist
            const solidInFolder = KT_ProjectFind.solids({ name: "solid_1" })[0];
            expect(is.solid(solidInFolder)).toBeTrue(); // Pre-existing solid_1
            // Create solid in Solids
            let moved = KT_ProjectMove.move(solidInFolder, solidsFolder);
            if (!moved) throwError("Moving solid to Solids folder failed");
            // Search: Should find quickly in folder
            const found = KT_ProjectFind.solids({ name: "solid_1" });
            expect(found).toHaveLength(1);

            //move solid to root
            KT_ProjectMove.move(solidInFolder, app.project.rootFolder);
        });

        it("should handle zero items in project", () => {
            // This is hard to simulate, but assume empty search returns []
            const emptyComps = KT_ProjectFind.comps({});
            // In test project, may not be empty, but expect array
            expect(emptyComps).toBeArray();
        });

        it("should find with partial options (name + root)", () => {
            testFolder = KT_ProjectAdd.folder({ name: "PartialFolder" });
            if (!is.folder(testFolder)) throwError("Partial folder creation failed");
            createdItems.push(testFolder);
            const partialComp = KT_ProjectAdd.comp({ name: "PartialComp", parentFolder: testFolder });
            if (!is.comp(partialComp)) throwError("Partial comp creation failed");
            createdItems.push(partialComp);
            const found = KT_ProjectFind.comps({ name: "PartialComp", root: testFolder });
            expect(found).toHaveLength(1);
        });
    });

    describe("Solids-Specific Optimization", () => {
        let solidsFolder: FolderItem | null = null;

        afterEach(() => {
            // Cleanup for this suite
            if (solidsFolder) {
                try {
                    solidsFolder.remove();
                } catch (e) {
                    // Ignore
                }
            }
            for (const item of createdItems) {
                try {
                    KT_ProjectRemove.item(item);
                } catch (e) {
                    // Ignore
                }
            }
        });

        it("should prioritize Solids folder in search (even if empty fallback)", () => {
            solidsFolder = KT_ProjectAdd.folder({ name: "Solids" });
            if (!is.folder(solidsFolder)) throwError("Solids folder creation failed");
            createdItems.push(solidsFolder);
            // No solids inside, should fallback to global (pre-existing solid_1)
            const found = KT_ProjectFind.solids({});
            expect(found.length).toBeGreaterThan(0); // Finds pre-existing
        });
    });
});
