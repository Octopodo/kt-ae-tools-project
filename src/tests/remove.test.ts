import {
    describe,
    it,
    expect,
    runTests,
    beforeEach,
    afterEach,
} from "kt-testing-suite-core";
import { KT_Project } from "../index";

describe("KT_Project.remove Tests", () => {
    let createdItems: _ItemClasses[] = [];

    beforeEach(() => {
        createdItems = [];
    });

    afterEach(() => {
        // Note: Items are removed in tests, so no need to clean here
    });

    it("should remove a comp by object", () => {
        const comp = KT_Project.add.comp({ name: "Remove Comp" });
        createdItems.push(comp);
        expect(KT_Project.find.comp({ name: "Remove Comp" })).toBeTruthy();

        const result = KT_Project.remove.item(comp);
        expect(result).toBe(true);

        const found = KT_Project.find.comp({ name: "Remove Comp" });
        expect(found).toBe(false);
    });

    it("should remove a folder by path", () => {
        const folder = KT_Project.add.folder({ name: "Remove Folder" });
        createdItems.push(folder);
        expect(KT_Project.find.folder({ name: "Remove Folder" })).toBe(folder);

        const result = KT_Project.remove.item("//Remove Folder");
        expect(result).toBe(true);

        const found = KT_Project.find.folder({ name: "Remove Folder" });
        expect(found).toBe(false);
    });

    it("should remove multiple items", () => {
        const comp1 = KT_Project.add.comp({ name: "Remove Comp1" });
        const comp2 = KT_Project.add.comp({ name: "Remove Comp2" });
        createdItems.push(comp1, comp2);

        const result = KT_Project.remove.item([comp1, comp2]);
        expect(result).toBe(true);

        const found1 = KT_Project.find.comp({ name: "Remove Comp1" });
        const found2 = KT_Project.find.comp({ name: "Remove Comp2" });
        expect(found1).toBe(false);
        expect(found2).toBe(false);
    });

    it("should return false for invalid path", () => {
        const result = KT_Project.remove.item("//NonExistent");
        expect(result).toBe(false);
    });

    it("should remove comp by options", () => {
        const comp = KT_Project.add.comp({ name: "Remove Comp Options" });
        expect(
            KT_Project.find.comp({ name: "Remove Comp Options" })
        ).toBeTruthy();

        const result = KT_Project.remove.comp(comp);
        expect(result).toBe(true);

        const found = KT_Project.find.comp({ name: "Remove Comp Options" });
        expect(found).toBe(false);
    });

    it("should remove folder by options", () => {
        const folder = KT_Project.add.folder({ name: "Remove Folder Options" });
        expect(
            KT_Project.find.folder({ name: "Remove Folder Options" })
        ).toBeTruthy();

        const result = KT_Project.remove.folder(folder);
        expect(result).toBe(true);

        const found = KT_Project.find.folder({ name: "Remove Folder Options" });
        expect(found).toBe(false);
    });

    // For footage, image, audio, video, solid, duplicate existing if any
    // it("should remove footage by duplicating and removing", () => {
    //     const existing = KT_Project.find.footage();
    //     if (existing !== false) {
    //         const items = existing as FootageItem[];
    //         if (items.length > 0) {
    //             const dup = KT_Project.duplicate.footage(items[0]);
    //             if (dup) {
    //                 const result = KT_Project.remove.footage(
    //                     dup as FootageItem
    //                 );
    //                 expect(result).toBe(true);
    //             } else {
    //                 expect(true).toBe(true);
    //             }
    //         } else {
    //             expect(true).toBe(true);
    //         }
    //     } else {
    //         expect(true).toBe(true); // Skip if no footage
    //     }
    // });

    // it("should remove image by duplicating and removing", () => {
    //     const existing = KT_Project.find.image();
    //     if (existing !== false) {
    //         const items = existing as FootageItem[];
    //         if (items.length > 0) {
    //             const dup = KT_Project.duplicate.image(items[0]);
    //             if (dup) {
    //                 const result = KT_Project.remove.image(dup as FootageItem);
    //                 expect(result).toBe(true);
    //             } else {
    //                 expect(true).toBe(true);
    //             }
    //         } else {
    //             expect(true).toBe(true);
    //         }
    //     } else {
    //         expect(true).toBe(true);
    //     }
    // });

    // it("should remove audio by duplicating and removing", () => {
    //     const existing = KT_Project.find.audio();
    //     if (existing !== false) {
    //         const items = existing as FootageItem[];
    //         if (items.length > 0) {
    //             const dup = KT_Project.duplicate.audio(items[0]);
    //             if (dup) {
    //                 const result = KT_Project.remove.audio(dup as FootageItem);
    //                 expect(result).toBe(true);
    //             } else {
    //                 expect(true).toBe(true);
    //             }
    //         } else {
    //             expect(true).toBe(true);
    //         }
    //     } else {
    //         expect(true).toBe(true);
    //     }
    // });

    // it("should remove video by duplicating and removing", () => {
    //     const existing = KT_Project.find.video();
    //     if (existing !== false) {
    //         const items = existing as FootageItem[];
    //         if (items.length > 0) {
    //             const dup = KT_Project.duplicate.video(items[0]);
    //             if (dup) {
    //                 const result = KT_Project.remove.video(dup as FootageItem);
    //                 expect(result).toBe(true);
    //             } else {
    //                 expect(true).toBe(true);
    //             }
    //         } else {
    //             expect(true).toBe(true);
    //         }
    //     } else {
    //         expect(true).toBe(true);
    //     }
    // });

    // it("should remove solid by duplicating and removing", () => {
    //     const existing = KT_Project.find.solid();
    //     if (existing !== false) {
    //         const items = existing as _ItemClasses[];
    //         if (items.length > 0) {
    //             const dup = KT_Project.duplicate.solid(items[0]);
    //             if (dup) {
    //                 const result = KT_Project.remove.solid(dup as FootageItem);
    //                 expect(result).toBe(true);
    //             } else {
    //                 expect(true).toBe(true);
    //             }
    //         } else {
    //             expect(true).toBe(true);
    //         }
    //     } else {
    //         expect(true).toBe(true);
    //     }
    // });
});
