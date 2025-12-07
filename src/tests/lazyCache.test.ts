// Regex for "UniqueAudioFile_.*"
import { describe, it, beforeEach, afterEach, expect } from "kt-testing-suite-core";
import { KT_LazyCache } from "../lazyCache";
import { KT_ProjectImport } from "../import";
import { KT_ProjectRemove } from "../remove";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { IO } from "kt-io";
import { KT_AeProjectPath } from "../path";

describe("KT_LazyCache Implementation", () => {
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
        KT_LazyCache.clear();
        // Also ensure project doesn't have leftover items from failed previous runs
        for (let i = app.project.numItems; i >= 1; i--) {
            // Be careful not to delete things if the user has an open project,
            // but usually tests run in a controlled env.
            // prioritizing just cleaning up what we import.
        }
    });

    afterEach(() => {
        // Cleanup imported items
        for (const item of importedItems) {
            if (item && KT_LazyCache.getById(item.id)) {
                // If it's still in the project/cache, remove it via project remove
                // (which should trigger cache remove if we were using listeners, but here we do manual)
                try {
                    item.remove();
                } catch (e) {}
            }
        }
        importedItems = [];
        KT_LazyCache.clear();
    });

    it("should initialize and scan the project", () => {
        KT_LazyCache.init();
        expect(KT_LazyCache["_initialized"]).toBe(true);
    });

    describe("add()", () => {
        it("should add an audio item to allItems and audio cache", () => {
            // 1. Import item (bypassing cache auto-add if any)
            const result = KT_ProjectImport.files({ path: audioPath });
            const item = result[0] as FootageItem;
            importedItems.push(item);

            // 2. Add to LazyCache
            KT_LazyCache.add(item);

            // 3. Verify in Global Cache
            const inGlobal = KT_LazyCache.allItems.getById(item.id);
            expect(inGlobal).toBeDefined();
            expect(inGlobal!.id).toBe(item.id);

            // 4. Verify in Audio Cache (accessing public property as per current state)
            const inAudio = KT_LazyCache.audio.getById(item.id);
            expect(inAudio).toBeDefined();
            expect(inAudio!.id).toBe(item.id);

            // 5. Verify NOT in other caches
            expect(KT_LazyCache.video.getById(item.id)).toBeUndefined();
            expect(KT_LazyCache.comps.getById(item.id)).toBeUndefined();
        });

        it("should correctly calculate path when adding without known path", () => {
            const result = KT_ProjectImport.files({ path: imagePath });
            const item = result[0] as FootageItem;
            importedItems.push(item);

            KT_LazyCache.add(item);

            const expectedPath = KT_AeProjectPath.get(item);
            const cachedItem = KT_LazyCache.allItems.getByPath(expectedPath);

            expect(cachedItem).toBeDefined();
            expect(cachedItem!.id).toBe(item.id);
        });

        it("should add folders to folder cache", () => {
            const folder = app.project.items.addFolder("LazyTestFolder");
            importedItems.push(folder);

            KT_LazyCache.add(folder);

            expect(KT_LazyCache.folders.getById(folder.id)).toBeDefined();
            expect(KT_LazyCache.allItems.getById(folder.id)).toBeDefined();
        });
    });

    describe("remove()", () => {
        it("should remove an item from all relevant caches", () => {
            // Setup
            const result = KT_ProjectImport.files({ path: videoPath });
            const item = result[0] as FootageItem;
            importedItems.push(item);
            KT_LazyCache.add(item);

            // Verify added
            expect(KT_LazyCache.video.getById(item.id)).toBeDefined();

            // Act
            KT_LazyCache.remove(item);

            // Assert
            expect(KT_LazyCache.allItems.getById(item.id)).toBeUndefined();
            expect(KT_LazyCache.video.getById(item.id)).toBeUndefined();
        });

        it("should clean up path index upon removal", () => {
            const result = KT_ProjectImport.files({ path: imagePath });
            const item = result[0] as FootageItem;
            importedItems.push(item);
            KT_LazyCache.add(item);

            const path = KT_AeProjectPath.get(item);
            expect(KT_LazyCache.allItems.getByPath(path)).toBeDefined();

            KT_LazyCache.remove(item);

            expect(KT_LazyCache.allItems.getByPath(path)).toBeUndefined();
        });
    });

    describe("Type Segregation", () => {
        it("should segregate items into correct sub-caches", () => {
            const audio = KT_ProjectImport.files({ path: audioPath })[0] as FootageItem;
            const video = KT_ProjectImport.files({ path: videoPath })[0] as FootageItem;
            const image = KT_ProjectImport.files({ path: imagePath })[0] as FootageItem;
            importedItems.push(audio, video, image);

            KT_LazyCache.add(audio);
            KT_LazyCache.add(video);
            KT_LazyCache.add(image);

            expect(KT_LazyCache.audio.getById(audio.id)).toBeDefined();
            expect(KT_LazyCache.video.getById(audio.id)).toBeUndefined();

            expect(KT_LazyCache.video.getById(video.id)).toBeDefined();
            expect(KT_LazyCache.audio.getById(video.id)).toBeUndefined();

            expect(KT_LazyCache.images.getById(image.id)).toBeDefined();
        });
    });

    describe("RegExp Optimization (Integration)", () => {
        it("should find items by RegExp via global cache", () => {
            const itemName1 = "UniqueAudioFile_01.wav";
            const itemName2 = "UniqueAudioFile_02.wav";

            // Rename for unique test
            const audio1 = KT_ProjectImport.files({ path: audioPath })[0];
            audio1.name = itemName1;
            const audio2 = KT_ProjectImport.files({ path: audioPath })[0];
            audio2.name = itemName2;
            importedItems.push(audio1, audio2);

            KT_LazyCache.add(audio1);
            KT_LazyCache.add(audio2);

            // Regex for "UniqueAudioFile_.*"
            const regex = /UniqueAudioFile_.*\./;
            const results = KT_LazyCache.allItems.getByRegExp(regex);

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
});
