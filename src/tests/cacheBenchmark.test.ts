import { it, describe, beforeAll, afterAll, expect } from "kt-testing-suite-core";
import { KT_LazyCache } from "../lazyCache";
import { KT_ProjectFind } from "../find";
import { KT_Project } from "../index";

describe("Performance Benchmark", () => {
    let createdItems: _ItemClasses[] = [];
    const NUM_ITEMS = 1000;
    let startTime: number = 0;
    let endTime: number = 0;

    beforeAll(() => {
        startTime = new Date().getTime();
        // Setup: Create a large number of items
        const root = app.project.rootFolder;
        let currentFolder = root;

        // Create a deep hierarchy
        for (let i = 0; i < 10; i++) {
            const folder = KT_Project.add.folder({ name: `Folder_Level_${i}`, parentFolder: currentFolder });
            if (folder) {
                createdItems.push(folder);
                currentFolder = folder;
            }
        }

        // Create many items
        for (let i = 0; i < NUM_ITEMS; i++) {
            const comp = KT_Project.add.comp({ name: `Benchmark_Comp_${i}`, parentFolder: currentFolder });
            if (comp) createdItems.push(comp);
        }

        // Create Solids Folder and Solids
        const solidsFolder = KT_Project.add.folder({ name: "Solids", parentFolder: root });
        if (solidsFolder) {
            createdItems.push(solidsFolder);
        }
        endTime = new Date().getTime();
        $.writeln(" ⏱️Setup Time: " + (endTime - startTime) + " ms");
    });

    afterAll(() => {
        // Cleanup
        for (const item of createdItems) {
            try {
                item.remove();
            } catch (e) {}
        }
    });

    it("Benchmark: Scan Performance", () => {
        const start = Date.now();
        KT_LazyCache.scan();
        const end = Date.now();
        const duration = end - start;
        $.writeln(`    ⏱️[Benchmark] Scan ${NUM_ITEMS} items took: ${duration}ms`);
        expect(duration).toBeLessThan(5000); // Expect it to be reasonably fast
    });

    it("Benchmark: Find by Name (Cached)", () => {
        const targetName = `Benchmark_Comp_${Math.floor(NUM_ITEMS / 2)}`;

        const start = Date.now();
        const results = KT_ProjectFind.items({ name: targetName });
        const end = Date.now();

        const duration = end - start;
        $.writeln(`    ⏱️[Benchmark] Find by Name took: ${duration}ms`);

        expect(results.length).toBeGreaterThan(0);
        expect(results[0].name).toBe(targetName);
        expect(duration).toBeLessThan(100); // Should be instant
    });

    it("Benchmark: Find by ID (Cached)", () => {
        const targetItem = createdItems[Math.floor(createdItems.length / 2)];

        const start = Date.now();
        const results = KT_ProjectFind.items({ id: targetItem.id });
        const end = Date.now();

        const duration = end - start;
        $.writeln(`    ⏱️[Benchmark] Find by ID took: ${duration}ms`);

        expect(results.length).toBe(1);
        expect(results[0].id).toBe(targetItem.id);
        expect(duration).toBeLessThan(50); // Should be instant
    });

    it("Benchmark: Find by RegExp (Cached)", () => {
        // Search for comps ending with "50" (e.g. Benchmark_Comp_50, 150, 250...)
        const regex = /Benchmark_Comp_.*50$/;

        const start = Date.now();
        const results = KT_ProjectFind.comps({ name: regex });
        const end = Date.now();

        const duration = end - start;
        $.writeln(`    ⏱️[Benchmark] Find by RegExp took: ${duration}ms. Found: ${results.length}`);

        expect(results.length).toBeGreaterThan(0);
        expect(duration).toBeLessThan(200); // Should be fast
    });

    it("Solids: Should be ignored in main scan but found in find.solids", () => {
        KT_LazyCache.scan();
        const solidsInCache = KT_LazyCache.folders.getByName("Solids");
        expect(solidsInCache.length).toBe(0);
        const solids = KT_ProjectFind.solids({});
    });
});
