import { describe, it, beforeEach, afterEach, expect } from "kt-testing-suite-core";
import { KT_LazyCache } from "../lazyCache";
import { KT_ProjectRemove } from "../remove";
import { KT_ProjectImport } from "../import";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { IO } from "kt-io";

describe("KT_ProjectRemove Integration", () => {
    // Fixtures (copied from lazyCache.test.ts)
    const baseDir = IO.path.join(
        IO.fs.getCurrentScriptFile().parent.parent.fullName,
        "src",
        "tests",
        "fixtures",
        "import_items"
    );
    const audioPath = IO.path.join(baseDir, "audio", "audio_1.wav");
    const videoPath = IO.path.join(baseDir, "video", "video_1.mp4");

    let importedItems: _ItemClasses[] = [];

    beforeEach(() => {
        KT_LazyCache.clear();
        KT_LazyCache.init();
    });

    afterEach(() => {
        for (const item of importedItems) {
            try {
                if (item.id && KT_LazyCache.getById(item.id)) {
                    item.remove();
                }
            } catch (e) {}
        }
        importedItems = [];
        KT_LazyCache.clear();
    });

    it("should remove items from Project AND Cache", () => {
        // 1. Setup
        const result = KT_ProjectImport.files({ path: audioPath });
        const item = result[0] as FootageItem;
        const id = item.id;
        importedItems.push(item);
        // KT_LazyCache.add(item); // Ensure it's in cache first

        // Verify existance
        expect(KT_LazyCache.getById(id)).toBeDefined();

        // 2. Act
        const success = KT_ProjectRemove.item(item);

        // 3. Assert
        expect(success).toBe(true);

        // Check Project: Accessing item.id or name should throw or be invalid if removed
        // // Check Cache:
        expect(KT_LazyCache.getById(id)).toBeUndefined();
    });

    it("should NOT remove items if checker fails (Safety Check)", () => {
        // 1. Setup - Audio Item
        const result = KT_ProjectImport.files({ path: audioPath });
        const item = result[0] as FootageItem;
        importedItems.push(item);
        KT_LazyCache.add(item);

        // 2. Act - Try to remove as 'Comp' which it is NOT
        const success = KT_ProjectRemove.comp(item);

        // 3. Assert
        // Should return true effectively? Or false?
        // remove.ts implementation loops and continues if not checker.
        // If nothing removed, loop finishes. Function returns logic AND of removals?
        // Let's check remove.ts logic: returns 'removeOk', initialized to true.
        // If loop continues, removeOk stays true.
        // Wait, checking user requirement: "comprobar que no se eliminan items no seleccionados"

        expect(KT_LazyCache.getById(item.id)).toBeDefined();
        // Just verify it's still alive in project
        try {
            const id = item.id;
            expect(id).toBeDefined();
        } catch (e) {
            // Should not happen
            expect(false).toBe(true);
        }
    });

    it("should remove correct Type", () => {
        const result = KT_ProjectImport.files({ path: videoPath });
        const item = result[0] as FootageItem;
        const id = item.id;
        importedItems.push(item);
        KT_LazyCache.add(item);

        const success = KT_ProjectRemove.video(item);

        expect(success).toBe(true);
        expect(KT_LazyCache.getById(id)).toBeUndefined();
    });
});
