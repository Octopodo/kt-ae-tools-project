import { describe, it, beforeEach, afterEach, expect, throwError } from "kt-testing-suite-core";
import { KT_ProjectImport } from "../import";
import { KT_ProjectFind } from "../find";
import { KT_ProjectRemove } from "../remove";
import { KT_ProjectAdd } from "../add";
import { KT_AeIs as is } from "kt-ae-is-checkers";
import { IO } from "kt-io";

describe("KT_ProjectImport", () => {
    let importedItems: _ItemClasses[] = [];
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

    beforeEach(() => {
        // Assuming fixture files exist: audio_1.wav, audio_2.wav, etc.
    });

    afterEach(() => {
        // Clean up imported items
        for (let i = 0; i < importedItems.length; i++) {
            KT_ProjectRemove.item(importedItems[i]);
        }
        importedItems = [];
    });

    describe("audios()", () => {
        it("should import audio files from audio folder", () => {
            const audioPath = IO.path.join(audioFolder, "audio_1.wav");
            const result = KT_ProjectImport.audios({ path: audioPath });
            expect(result instanceof Array).toBe(true);
            if (result.length > 0) {
                expect(is.audio(result[0])).toBe(true);
                importedItems.push(...result);
            }
        });

        it("should import multiple audio files", () => {
            const audioPath1 = IO.path.join(audioFolder, "audio_1.wav");
            const audioPath2 = IO.path.join(audioFolder, "audio_2.wav");
            const result = KT_ProjectImport.audios({
                path: [audioPath1, audioPath2],
            });
            expect(result instanceof Array).toBe(true);
            expect(result.length).toBeGreaterThanOrEqual(2);
            for (let i = 0; i < result.length; i++) {
                expect(is.audio(result[i])).toBe(true);
            }
            importedItems.push(...result);
        });

        it("should not import non-audio files from mixed folder", () => {
            const result = KT_ProjectImport.audios({ path: mixedFolder });
            expect(result instanceof Array).toBe(true);
            for (let i = 0; i < result.length; i++) {
                expect(is.audio(result[i])).toBe(true);
            }
            importedItems.push(...result);
        });

        it("should import all audio files from audio folder when passing folder path", () => {
            const result = KT_ProjectImport.audios({ path: audioFolder });
            expect(result instanceof Array).toBe(true);
            expect(result.length).toBeGreaterThanOrEqual(2); // audio_1.wav, audio_2.wav
            for (let i = 0; i < result.length; i++) {
                expect(is.audio(result[i])).toBe(true);
            }
            importedItems.push(...result);
        });
        it("should handle toComp option with audio files", () => {
            const audioPath = IO.path.join(audioFolder, "audio_1.wav");
            const result = KT_ProjectImport.files({
                path: audioPath,
                toComp: true,
            });
            expect(result instanceof Array).toBe(true);
            const compItems = KT_ProjectFind.comps({ name: "audio_1" });
            expect(compItems.length).toBe(1);

            importedItems.push(...result, ...compItems);
        });
    });

    describe("videos()", () => {
        it("should import video files from video folder", () => {
            const videoPath = IO.path.join(videoFolder, "video_1.mp4");
            const result = KT_ProjectImport.videos({ path: videoPath });
            expect(result instanceof Array).toBe(true);
            if (result.length > 0) {
                expect(is.video(result[0])).toBe(true);
                importedItems.push(...result);
            }
        });

        it("should import multiple video files", () => {
            const videoPath1 = IO.path.join(videoFolder, "video_1.mp4");
            const videoPath2 = IO.path.join(videoFolder, "video_2.mp4");
            const result = KT_ProjectImport.videos({
                path: [videoPath1, videoPath2],
            });
            expect(result instanceof Array).toBe(true);
            expect(result.length).toBeGreaterThanOrEqual(2);
            for (let i = 0; i < result.length; i++) {
                expect(is.video(result[i])).toBe(true);
            }
            importedItems.push(...result);
        });

        it("should not import non-video files from mixed folder", () => {
            const result = KT_ProjectImport.videos({ path: mixedFolder });
            expect(result instanceof Array).toBe(true);
            for (let i = 0; i < result.length; i++) {
                expect(is.video(result[i])).toBe(true);
            }
            importedItems.push(...result);
        });

        it("should import all video files from video folder when passing folder path", () => {
            const result = KT_ProjectImport.videos({ path: videoFolder });
            expect(result instanceof Array).toBe(true);
            expect(result.length).toBeGreaterThanOrEqual(2); // video_1.mp4, video_2.mp4
            for (let i = 0; i < result.length; i++) {
                expect(is.video(result[i])).toBe(true);
            }
            importedItems.push(...result);
        });
    });

    describe("images()", () => {
        it("should import image files from image folder", () => {
            const imagePath = IO.path.join(imageFolder, "image_1.jpg");
            const result = KT_ProjectImport.images({ path: imagePath });
            expect(result instanceof Array).toBe(true);
            expect(result.length).toBeGreaterThanOrEqual(1);
            if (result.length > 0) {
                expect(is.image(result[0])).toBe(true);
                importedItems.push(...result);
            }
        });

        it("should import multiple image files", () => {
            const imagePath1 = IO.path.join(imageFolder, "image_1.jpg");
            const imagePath2 = IO.path.join(imageFolder, "image_2.jpg");
            const result = KT_ProjectImport.images({
                path: [imagePath1, imagePath2],
            });
            expect(result instanceof Array).toBe(true);
            expect(result.length).toBeGreaterThanOrEqual(2);
            for (let i = 0; i < result.length; i++) {
                expect(is.image(result[i])).toBe(true);
            }
            importedItems.push(...result);
        });

        it("should not import non-image files from mixed folder", () => {
            const result = KT_ProjectImport.images({ path: mixedFolder });
            expect(result instanceof Array).toBe(true);
            for (let i = 0; i < result.length; i++) {
                expect(is.image(result[i])).toBe(true);
            }
            importedItems.push(...result);
        });

        it("should import all image files from image folder when passing folder path", () => {
            const result = KT_ProjectImport.images({ path: imageFolder });
            expect(result instanceof Array).toBe(true);
            expect(result.length).toBeGreaterThanOrEqual(2); // image_1.jpg, image_2.jpg
            for (let i = 0; i < result.length; i++) {
                expect(is.image(result[i])).toBe(true);
            }
            importedItems.push(...result);
        });
    });

    describe("footage()", () => {
        it("should import all footage types from mixed folder", () => {
            const result = KT_ProjectImport.footage({ path: mixedFolder });
            expect(result instanceof Array).toBe(true);
            // Should import audio, video, and image files
            let hasAudio = false;
            let hasVideo = false;
            let hasImage = false;
            for (let i = 0; i < result.length; i++) {
                if (is.audio(result[i])) hasAudio = true;
                if (is.video(result[i])) hasVideo = true;
                if (is.image(result[i])) hasImage = true;
            }
            expect(hasAudio || hasVideo || hasImage).toBe(true);
            importedItems.push(...result);
        });

        it("should import all footage files from mixed folder when passing folder path", () => {
            const result = KT_ProjectImport.footage({ path: mixedFolder });
            expect(result instanceof Array).toBe(true);
            expect(result.length).toBeGreaterThanOrEqual(3); // audio_1.wav, video_1.mp4, image_1.jpg
            let hasAudio = false;
            let hasVideo = false;
            let hasImage = false;
            for (let i = 0; i < result.length; i++) {
                if (is.audio(result[i])) hasAudio = true;
                if (is.video(result[i])) hasVideo = true;
                if (is.image(result[i])) hasImage = true;
            }
            expect(hasAudio && hasVideo && hasImage).toBe(true);
            importedItems.push(...result);
        });
    });

    describe("folders()", () => {
        it("should import folders recursively from nested folder", () => {
            const result = KT_ProjectImport.folders({ path: nestedFolder, recursive: true });
            expect(result instanceof Array).toBe(true);
            importedItems.push(...result);
        });

        it("should import folders flatly", () => {
            const result = KT_ProjectImport.folders({ path: nestedFolder, flat: true });
            expect(result instanceof Array).toBe(true);
            importedItems.push(...result);
        });

        it("should replicate folder structure when flat is false", () => {
            const result = KT_ProjectImport.folders({ path: nestedFolder, flat: false });
            expect(result instanceof Array).toBe(true);
            const nestedFolderItems = KT_ProjectFind.folders({ name: "nested" });
            expect(nestedFolderItems.length).toBe(1);
            importedItems.push(...result, ...nestedFolderItems);
        });
    });

    describe("files()", () => {
        it("should import specific files", () => {
            const mixedAudioPath = IO.path.join(mixedFolder, "audio_1.wav");
            const result = KT_ProjectImport.files({ path: mixedAudioPath });
            expect(result instanceof Array).toBe(true);
            if (result.length > 0) {
                expect(is.footage(result[0])).toBe(true);
                importedItems.push(...result);
            }
        });

        it("should import multiple files", () => {
            const audioPath = IO.path.join(audioFolder, "audio_1.wav");
            const videoPath = IO.path.join(videoFolder, "video_1.mp4");
            const result = KT_ProjectImport.files({
                path: [audioPath, videoPath],
            });
            expect(result instanceof Array).toBe(true);
            expect(result.length).toBeGreaterThanOrEqual(2);
            importedItems.push(...result);
        });
    });

    describe("options handling", () => {
        it("should handle parent folder option", () => {
            const testFolder = KT_ProjectAdd.folder({ name: "ImportTestFolder" });
            const audioPath = IO.path.join(audioFolder, "audio_1.wav");
            const result = KT_ProjectImport.files({
                path: audioPath,
                parent: testFolder,
            });
            expect(result instanceof Array).toBe(true);
            importedItems.push(...result, testFolder);
        });

        it("should handle toComp option", () => {
            const imagePath = IO.path.join(imageFolder, "image_1.jpg");
            const result = KT_ProjectImport.files({
                path: imagePath,
                toComp: true,
            });
            expect(result instanceof Array).toBe(true);
            const compItems = KT_ProjectFind.comps({ name: "image_1" });
            expect(compItems.length).toBe(1);

            importedItems.push(...result, ...compItems);
        });
    });

    describe("error handling", () => {
        it("should handle invalid paths", () => {
            const result = KT_ProjectImport.files({ path: "invalid/path.xyz" });
            expect(result instanceof Array).toBe(true);
            expect(result.length).toBe(0);
        });

        it("should handle empty path array", () => {
            const result = KT_ProjectImport.files({ path: [] });
            expect(result instanceof Array).toBe(true);
            expect(result.length).toBe(0);
        });
    });

    describe("footageFolder and compFolder options", () => {
        it("should handle footageFolder option", () => {
            const audioPath = IO.path.join(audioFolder, "audio_1.wav");
            const result = KT_ProjectImport.footage({
                path: audioPath,
                footageFolder: "FootageTarget",
            });
            expect(result instanceof Array).toBe(true);
            const footageFolders = KT_ProjectFind.folders({ name: "FootageTarget" });
            expect(footageFolders.length).toBe(1);
            const children = footageFolders[0].items;
            expect(children.length).toBeGreaterThan(0);
            expect(children[1]).toBe(result[0]);
            importedItems.push(...result, ...footageFolders);
        });
        it("should handle compFolder option", () => {
            const imagePath = IO.path.join(imageFolder, "image_1.jpg");
            const result = KT_ProjectImport.files({
                path: imagePath,
                toComp: true,
                compFolder: "CompTarget",
            });
            expect(result instanceof Array).toBe(true);
            const compFolders = KT_ProjectFind.folders({ name: "CompTarget" });
            expect(compFolders.length).toBe(1);
            const children = compFolders[0].items;
            const compItem = KT_ProjectFind.comps({ name: "image_1" })[0];
            expect(compItem).toBeDefined();
            expect(children.length).toBeGreaterThan(0);
            expect(children[1]).toBe(compItem);
            importedItems.push(...result, ...compFolders);
        });

        it("should handle both footageFolder and compFolder options together", () => {
            const audioPath = IO.path.join(audioFolder, "audio_1.wav");
            const imagePath = IO.path.join(imageFolder, "image_1.jpg");
            const result = KT_ProjectImport.files({
                path: [audioPath, imagePath],
                toComp: true,
                footageFolder: "FootageTarget",
                compFolder: "CompTarget",
            });
            expect(result instanceof Array).toBe(true);
            const footageFolders = KT_ProjectFind.folders({ name: "FootageTarget" });
            expect(footageFolders.length).toBe(1);
            const compFolders = KT_ProjectFind.folders({ name: "CompTarget" });
            expect(compFolders.length).toBe(1);
            const footageChildren = footageFolders[0].items;
            const compChildren = compFolders[0].items;
            const imageCompItem = KT_ProjectFind.comps({ name: "image_1" })[0];
            const audioCompItem = KT_ProjectFind.comps({ name: "audio_1" })[0];
            const imageFootageItem = KT_ProjectFind.footage({ name: "image_1.jpg" })[0];
            const audioFootageItem = KT_ProjectFind.footage({ name: "audio_1.wav" })[0];
            expect(imageCompItem).toBeDefined();
            expect(audioCompItem).toBeDefined();
            expect(imageFootageItem).toBeDefined();
            expect(audioFootageItem).toBeDefined();
            expect(footageChildren.length).toBeGreaterThan(0);
            expect(compChildren.length).toBeGreaterThan(0);
            expect(imageCompItem.parentFolder).toBe(compFolders[0]);
            expect(audioCompItem.parentFolder).toBe(compFolders[0]);
            expect(imageFootageItem.parentFolder).toBe(footageFolders[0]);
            expect(audioFootageItem.parentFolder).toBe(footageFolders[0]);
            importedItems.push(...result, ...footageFolders, ...compFolders);
        });
    });
    describe("Return as", () => {
        it("should return imported items as a comps when returnAs is 'comps'", () => {
            const imagePath1 = IO.path.join(imageFolder, "image_1.jpg");
            const imagePath2 = IO.path.join(imageFolder, "image_2.jpg");
            const result = KT_ProjectImport.files({
                path: [imagePath1, imagePath2],
                toComp: true,
                returnAs: "comps",
            });
            expect(result instanceof Array).toBe(true);
            expect(result.length).toBeGreaterThanOrEqual(2);
            for (let i = 0; i < result.length; i++) {
                expect(is.comp(result[i])).toBe(true);
            }
            importedItems.push(...result);
        });
    });

    it("sould create a comp from footage with video duration", () => {
        const videoPath = IO.path.join(videoFolder, "video_1.mp4");
        const comps = KT_ProjectImport.videos({ path: videoPath, toComp: true, returnAs: "comp" });
        expect(comps instanceof Array).toBe(true);
        if (!(comps[0] instanceof CompItem)) throwError("Imported item is not a CompItem");
        const compItem = comps[0];
        const footageDuration = (compItem.layers[1] as AVLayer).source.duration;
        expect(is.comp(compItem)).toBe(true);
        expect(compItem.duration).toBe(footageDuration);
        importedItems.push(compItem);
    });

    it("sould create a comp from footage with image default duration", () => {
        const imagePath = IO.path.join(imageFolder, "image_1.jpg");
        const comps = KT_ProjectImport.images({ path: imagePath, toComp: true, returnAs: "comp" });
        expect(comps instanceof Array).toBe(true);
        if (!(comps[0] instanceof CompItem)) throwError("Imported item is not a CompItem");
        const compItem = comps[0];
        if (!is.comp(compItem)) throwError("Imported item is not a CompItem");
        const defaultImageDuration = 10; // As per KT_ProjectAdd default
        expect(compItem.duration).toBe(defaultImageDuration);
        importedItems.push(compItem);
    });
});
