import { it, describe, expect, afterEach, beforeEach } from "kt-testing-suite-core";
import { KT_ProjectRender } from "../render";

describe("KT_Project.render Tests", () => {
    let createdComps: CompItem[] = [];
    const outputFolderPath = Folder.temp.fsName; // Using temp folder for output
    beforeEach(() => {
        createdComps = [];
    });

    afterEach(() => {
        // Clean up created comps
        // for (const comp of createdComps) {
        //     try {
        //         comp.remove();
        //     } catch (e) {}
        // }
        // createdComps = [];
    });
    // it("should add a comp to the render queue with default template", () => {
    //     const comp = app.project.items.addComp("Test Comp 1", 1920, 1080, 1, 5, 30);
    //     createdComps.push(comp);
    //     const renderQueueItems = KT_ProjectRender.addToQueue({
    //         comps: comp,
    //         path: outputFolderPath,
    //     });
    //     expect(renderQueueItems.length).toBe(1);
    //     const rqItem = renderQueueItems[0];
    //     expect(rqItem.comp).toBe(comp);
    // });

    // it("should add multiple comps to the render queue with custom template", () => {
    //     const comp1 = app.project.items.addComp("Test Comp 2", 1920, 1080, 1, 5, 30);
    //     const comp2 = app.project.items.addComp("Test Comp 3", 1280, 720, 1, 10, 24);
    //     createdComps.push(comp1, comp2);
    //     const renderQueueItems = KT_ProjectRender.addToQueue({
    //         comps: [comp1, comp2],
    //         path: outputFolderPath,
    //         template: "Apple ProRes 4444 XQ with alpha",
    //     });
    //     expect(renderQueueItems.length).toBe(2);
    //     expect(renderQueueItems[0].comp).toBe(comp1);
    //     expect(renderQueueItems[1].comp).toBe(comp2);
    // });

    it("should send comp to AME queue", () => {
        const comp = app.project.items.addComp("Test Comp 4", 1920, 1080, 1, 5, 30);
        createdComps.push(comp);
        const renderQueueItems = KT_ProjectRender.sendToAME({
            comps: comp,
            path: outputFolderPath,
        });
        expect(renderQueueItems.length).toBe(1);
        const rqItem = renderQueueItems[0];
        expect(rqItem.comp).toBe(comp);
    });
});
