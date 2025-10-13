import { describe, it, expect, runTests, beforeEach, afterEach, throwError } from "kt-testing-suite-core";
import { KT_Project } from "../index";

describe("KT_Project.add Tests", () => {
    let createdItems: _ItemClasses[] = [];

    beforeEach(() => {
        createdItems = [];
    });

    afterEach(() => {
        for (const item of createdItems) {
            try {
                item.remove();
            } catch (e) {}
        }
    });

    it("should create a comp with default values", () => {
        const comp = KT_Project.add.comp({ name: "Default Comp" });
        if (!comp) throwError("Comp creation failed");
        createdItems.push(comp);
        expect(comp.name).toBe("Default Comp");
        expect(comp.width).toBe(1920);
        expect(comp.height).toBe(1080);
    });

    it("should create a comp with custom values", () => {
        const comp = KT_Project.add.comp({
            name: "Custom Comp",
            width: 1280,
            height: 720,
            frameRate: 30,
            duration: 5,
        });
        if (!comp) throwError("Comp creation failed");

        createdItems.push(comp);
        expect(comp).toBeTruthy();
        expect(comp.name).toBe("Custom Comp");
        expect(comp.width).toBe(1280);
        expect(comp.height).toBe(720);
        expect(comp.frameRate).toBe(30);
        expect(comp.duration).toBe(5);
    });

    it("should create a comp in a specified folder by path", () => {
        const folder = KT_Project.add.folder({ name: "Test Folder" });
        const comp = KT_Project.add.comp({
            name: "Test Comp",
            parentFolder: "//Test Folder",
        });
        if (!comp) throwError("Comp creation failed");
        createdItems.push(folder, comp);
        expect(comp).toBeTruthy();
        expect(comp.parentFolder).toBe(folder);
    });

    it("should create a comp in a specified folder by object", () => {
        const folder = KT_Project.add.folder({ name: "Test Folder 2" });
        const comp = KT_Project.add.comp({
            name: "Test Comp 2",
            parentFolder: folder,
        });
        if (!comp) throwError("Comp creation failed");
        createdItems.push(folder, comp);
        expect(comp).toBeTruthy();
        expect(comp.parentFolder).toBe(folder);
    });

    it("should create a folder", () => {
        const folder = KT_Project.add.folder({ name: "New Folder" });
        if (!folder) throwError("Folder creation failed");
        createdItems.push(folder);
        expect(folder).toBeTruthy();
        expect(folder.name).toBe("New Folder");
    });

    it("should create a folder inside another folder by path", () => {
        const parentFolder = KT_Project.add.folder({ name: "Parent Folder" });
        const childFolder = KT_Project.add.folder({
            name: "Child Folder",
            parentFolder: "//Parent Folder",
        });
        createdItems.push(parentFolder, childFolder);
        expect(childFolder).toBeTruthy();
        expect(childFolder.parentFolder).toBe(parentFolder);
    });

    it("should create a folder inside another folder by object", () => {
        const parentFolder = KT_Project.add.folder({ name: "Parent Folder 2" });
        const childFolder = KT_Project.add.folder({
            name: "Child Folder 2",
            parentFolder: parentFolder,
        });
        createdItems.push(parentFolder, childFolder);
        expect(childFolder).toBeTruthy();
        expect(childFolder.parentFolder).toBe(parentFolder);
    });
});
