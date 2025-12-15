// Regex for "UniqueAudioFile_.*"
import { describe, it, beforeEach, afterEach, expect } from "kt-testing-suite-core";
import { KT_AeCache } from "../lazyCache";
import { KT_ProjectImport } from "../import";
import { KT_ProjectRemove } from "../remove";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { IO } from "kt-io";
import { KT_AeProjectPath } from "../path";
import { KT_ProjectMove } from "../move";

describe("KT_AeCache Implementation", () => {
    // Paths to fixtures
    const baseDir = IO.path.join(
        IO.fs.getCurrentScriptFile().parent.parent.fullName,
        "src",
        "tests",
        "fixtures",
        "import_items"
    );
    const audioPath = IO.path.join(baseDir, "audio", "audio_1.wav");
    const videoPath = IO.path.join(baseDir, "video", "video_1.mp4");
    const imagePath = IO.path.join(baseDir, "image", "image_1.jpg");

    let importedItems: _ItemClasses[] = [];

    beforeEach(() => {
        // Ensure cache is clean before each test
        KT_AeCache.clear();
        // Also ensure project doesn't have leftover items from failed previous runs
        for (let i = app.project.numItems; i >= 1; i--) {
            // Be careful not to delete things if the user has an open project,
            // but usually tests run in a controlled env.
            // prioritizing just cleaning up what we import.
        }
    });

    afterEach(() => {
        // Cleanup imported items
        // Reverse order to delete children before parents? Or parents before children?
        // Actually, deleting parent deletes children.
        // We just need to suppression errors if item is already gone.
        for (const item of importedItems) {
            try {
                // accessing item.id checks if object is valid in AE
                KT_AeCache.remove(item);
                item.remove();
            } catch (e) {
                // Item probably already removed or invalid
            }
        }
        importedItems = [];
        KT_AeCache.clear();
    });

    it("should initialize and scan the project", () => {
        KT_AeCache.init();
        expect(KT_AeCache["_initialized"]).toBe(true);
    });

    describe("add()", () => {
        it("should add an audio item to all and audio cache", () => {
            // 1. Import item (bypassing cache auto-add if any)
            const result = KT_ProjectImport.files({ path: audioPath });
            const item = result[0] as FootageItem;
            importedItems.push(item);

            // 2. Add to LazyCache
            KT_AeCache.add(item);

            // 3. Verify in Global Cache
            const inGlobal = KT_AeCache.all().getById(item.id);
            expect(inGlobal).toBeDefined();
            expect(inGlobal!.id).toBe(item.id);

            // 4. Verify in Audio Cache (accessing public property as per current state)
            const inAudio = KT_AeCache.audio().getById(item.id);
            expect(inAudio).toBeDefined();
            expect(inAudio!.id).toBe(item.id);

            // 5. Verify NOT in other caches
            expect(KT_AeCache.video().getById(item.id)).toBeUndefined();
            expect(KT_AeCache.comps().getById(item.id)).toBeUndefined();
        });

        it("should correctly calculate path when adding without known path", () => {
            const result = KT_ProjectImport.files({ path: imagePath });
            const item = result[0] as FootageItem;
            importedItems.push(item);

            KT_AeCache.add(item);

            const expectedPath = KT_AeProjectPath.get(item);
            const cachedItem = KT_AeCache.all().getByPath(expectedPath);

            expect(cachedItem).toBeDefined();
            expect(cachedItem!.id).toBe(item.id);
        });

        it("should add folders to folder cache", () => {
            const folder = app.project.items.addFolder("LazyTestFolder");
            importedItems.push(folder);

            KT_AeCache.add(folder);

            expect(KT_AeCache.folders().getById(folder.id)).toBeDefined();
            expect(KT_AeCache.all().getById(folder.id)).toBeDefined();
        });
    });

    describe("remove()", () => {
        it("should remove an item from all relevant caches", () => {
            // Setup
            const result = KT_ProjectImport.files({ path: videoPath });
            const item = result[0] as FootageItem;
            importedItems.push(item);
            KT_AeCache.add(item);

            // Verify added
            expect(KT_AeCache.video().getById(item.id)).toBeDefined();

            // Act
            KT_AeCache.remove(item);

            // Assert
            expect(KT_AeCache.all().getById(item.id)).toBeUndefined();
            expect(KT_AeCache.video().getById(item.id)).toBeUndefined();
        });

        it("should clean up path index upon removal", () => {
            const result = KT_ProjectImport.files({ path: imagePath });
            const item = result[0] as FootageItem;
            importedItems.push(item);
            KT_AeCache.add(item);

            const path = KT_AeProjectPath.get(item);
            expect(KT_AeCache.all().getByPath(path)).toBeDefined();

            KT_AeCache.remove(item);

            expect(KT_AeCache.all().getByPath(path)).toBeUndefined();
        });
    });

    describe("Type Segregation", () => {
        it("should segregate items into correct sub-caches", () => {
            const audio = KT_ProjectImport.files({ path: audioPath })[0] as FootageItem;
            const video = KT_ProjectImport.files({ path: videoPath })[0] as FootageItem;
            const image = KT_ProjectImport.files({ path: imagePath })[0] as FootageItem;
            importedItems.push(audio, video, image);

            KT_AeCache.add(audio);
            KT_AeCache.add(video);
            KT_AeCache.add(image);

            expect(KT_AeCache.audio().getById(audio.id)).toBeDefined();
            expect(KT_AeCache.video().getById(audio.id)).toBeUndefined();

            expect(KT_AeCache.video().getById(video.id)).toBeDefined();
            expect(KT_AeCache.audio().getById(video.id)).toBeUndefined();

            expect(KT_AeCache.images().getById(image.id)).toBeDefined();
        });
    });

    describe("RegExp Optimization (Integration)", () => {
        it("should find items by RegExp via global cache", () => {
            const itemName1 = "UniqueAudioFile_01.wav";
            const itemName2 = "UniqueAudioFile_02.wav";

            // Rename for unique test
            const audio1 = KT_ProjectImport.files({ path: audioPath })[0];
            audio1.name = itemName1;
            KT_AeCache.rename(audio1, itemName1);
            const audio2 = KT_ProjectImport.files({ path: audioPath })[0];
            audio2.name = itemName2;
            KT_AeCache.rename(audio2, itemName2);
            importedItems.push(audio1, audio2);

            // Regex for "UniqueAudioFile_.*"
            const regex = /UniqueAudioFile/;
            const results = KT_AeCache.all().getByRegExp(regex);

            expect(results.length).toBeGreaterThanOrEqual(2);

            // Check content
            const foundNames = results.map((i) => i.name);

            // Debug output to understand failure
            $.writeln("    Found Names: " + foundNames.toString());

            let found1 = false;
            let found2 = false;
            for (let i = 0; i < foundNames.length; i++) {
                if (foundNames[i] === itemName1) found1 = true;
                if (foundNames[i] === itemName2) found2 = true;
            }

            expect(found1).toBe(true);
            expect(found2).toBe(true);
        });
    });
    describe("update()", () => {
        it("should update item path after move", () => {
            const result = KT_ProjectImport.files({ path: imagePath });
            const item = result[0] as FootageItem;
            importedItems.push(item);

            const oldPath = KT_AeProjectPath.get(item);

            // Create a folder and move item into it
            const folder = app.project.items.addFolder("MoveTarget_1");
            importedItems.push(folder);
            KT_AeCache.add(folder);

            KT_ProjectMove.move(item, folder);

            // Act: Update cache
            // KT_AeCache.update(item);

            const newPath = KT_AeProjectPath.get(item);

            // Verify old path gone
            expect(KT_AeCache.all().getByPath(oldPath)).toBeUndefined();

            // Verify new path exists
            expect(KT_AeCache.all().getByPath(newPath)).toBeDefined();
            expect(KT_AeCache.all().getByPath(newPath)!.id).toBe(item.id);
        });

        it("should recursively update paths when folder moves", () => {
            // Setup Structure: Root -> Parent -> Child -> Item
            const parent = app.project.items.addFolder("ParentFolder");
            const childList = app.project.items.addFolder("ChildFolder"); // Add to root first
            KT_ProjectMove.move(childList, parent);

            // Re-fetch strictly to be safe or just use reference
            // Add items to cache
            KT_AeCache.add(parent);
            KT_AeCache.add(childList);

            const result = KT_ProjectImport.files({ path: audioPath });
            const item = result[0] as FootageItem;
            KT_ProjectMove.move(item, childList);
            importedItems.push(parent, childList, item);

            const oldItemPath = KT_AeProjectPath.get(item);

            // Move Parent to a new RootFolder
            const newRoot = app.project.items.addFolder("NewRoot");
            importedItems.push(newRoot);
            KT_AeCache.add(newRoot);

            KT_ProjectMove.move(parent, newRoot);

            // Act: Update Parent (should cascade)
            // KT_AeCache.update(parent);

            // Verify Item path updated automatically
            const newItemPath = KT_AeProjectPath.get(item);

            // Ensure logic: The item itself wasn't updated explicitly, so if cache is correct,
            // getByPath(newItemPath) should return it.
            const cachedItem = KT_AeCache.all().getByPath(newItemPath);

            expect(cachedItem).toBeDefined();
            if (cachedItem) {
                expect(cachedItem.id).toBe(item.id);
            }

            // Old path should be gone
            expect(KT_AeCache.all().getByPath(oldItemPath)).toBeUndefined();
        });
    });
});
