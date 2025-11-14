import { it, describe, beforeAll, beforeEach, afterAll, afterEach, throwError, expect } from "kt-testing-suite-core";
import { AE } from "kt-testing-suite-ae";
import { IO } from "kt-io";

import { KT_LazyCache as LazyCache } from "../lazyCache";

import { KT_Project } from "../index";

describe("__KT_LazyCache Tests", () => {
    let createdItems: _ItemClasses[] = [];
    let comps: CompItem[] = [];
    let folders: FolderItem[] = [];
    let footages: FootageItem[] = [];
    let solids: FootageItem[] = [];
    let images: FootageItem[] = [];
    let audios: FootageItem[] = [];
    const caheNames = ["id", "name", "path", "folder", "comp", "footage", "audio", "video", "image", "solid"];
    const baseDir = IO.path.join(
        IO.fs.getCurrentScriptFile().parent.parent.fullName,
        "src",
        "tests",
        "fixtures",
        "import_items"
    );

    const imageFolder = IO.path.join(baseDir, "image");
    const audioFolder = IO.path.join(baseDir, "audio");
    const videoFolder = IO.path.join(baseDir, "video");
    // const sequenceFolder = IO.path.join(baseDir, "sequence");
    const mixedFolder = IO.path.join(baseDir, "mixed");
    const nestedFolder = IO.path.join(baseDir, "nested");

    beforeAll(() => {
        createdItems = [];
        LazyCache.reset();

        for (let i = 0; i < 10; i++) {
            const name = i < 8 ? `Comp ${i}` : `Comp`;
            const comp = KT_Project.add.comp({ name });
            if (!comp) throwError("Testing comp creation failed");
            comps.push(comp);
            createdItems.push(comp);
        }

        for (let i = 0; i < 5; i++) {
            const name = i < 3 ? `Folder ${i}` : `Folder`;
            const folder = KT_Project.add.folder({ name });
            folders.push(folder);
            createdItems.push(folder);
        }

        images = KT_Project.import.folders(imageFolder) as FootageItem[];
        createdItems.push(...images);

        audios = KT_Project.import.folders(audioFolder) as FootageItem[];
        createdItems.push(...audios);
        footages = KT_Project.import.folders(videoFolder) as FootageItem[];
        createdItems.push(...footages);
        const nestedComp = KT_Project.add.comp({ name: "Nested Comp", parentFolder: folders[0] });
        if (!nestedComp) throwError("Testing nested comp creation failed");
        createdItems.push(nestedComp);
        folders[0].parentFolder = folders[1];
    });
    afterAll(() => {
        for (const item of createdItems) {
            try {
                item.remove();
            } catch (e) {}
        }
        LazyCache.reset();
    });

    describe("Cache Initialization", () => {
        it("should initialize the cache", () => {
            const lc = LazyCache;
            LazyCache.init(true);
            const debugCache = LazyCache.debugCache;
            if (!debugCache) throwError("Debug cache is not initialized");
            for (const cacheName of caheNames) {
                expect(debugCache).toHaveProperty(cacheName);
            }
        });
        it("Should scan and populate the cache", () => {
            LazyCache.init(true);
            LazyCache.scan();
            // LazyCache.print();
            const debugCache = LazyCache.debugCache;
            if (!debugCache) throwError("Debug cache is not initialized");
            for (const cacheName of caheNames) {
                const cache = debugCache[cacheName];
                if (cacheName !== "solid") expect(Object.keys(cache).length).toBeGreaterThan(0);
            }
        });
    });
});
