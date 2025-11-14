import { IO } from "kt-io";
import { KT_StringUtils as KT_String } from "kt-core";
import { KT_AeIs as is } from "kt-ae-is-checkers";

type KT_RenderOptions = {
    comps: _ItemClasses | _ItemClasses[];
    path: string;
    template?: string;
    renderInmedately?: boolean;
    AME?: boolean;
};

class __KT_ProjectRender {
    private DEFAULTE_TEMPLATE = "H.264 - Match Render Settings - 40 Mbps";

    sendToAME = (options: KT_RenderOptions): RenderQueueItem[] => {
        const RQItems: RenderQueueItem[] = this.addToQueue(options);
        options.renderInmedately = options.renderInmedately || false;
        if (app.project.renderQueue.canQueueInAME) {
            app.project.renderQueue.queueInAME(options.renderInmedately);
        }
        return RQItems;
    };

    addToQueue = (options: KT_RenderOptions): RenderQueueItem[] => {
        const RQItems: RenderQueueItem[] = [];
        const compsArray = options.comps instanceof Array ? (options.comps as CompItem[]) : [options.comps as CompItem];
        const templateName = options.template || this.DEFAULTE_TEMPLATE;
        for (let i = 0; i < compsArray.length; i++) {
            const comp = compsArray[i];
            if (!is.comp(comp)) continue;
            const rqItem = app.project.renderQueue.items.add(comp);
            const om = rqItem.outputModule(1);
            om.applyTemplate(templateName);
            let outputFilePath = IO.path.join(options.path, `${comp.name}`);
            outputFilePath = IO.path.sanitize(outputFilePath);
            om.file = new File(outputFilePath);
            RQItems.push(rqItem);
        }
        return RQItems;
    };

    toProResXQWithAlpha = (options: KT_RenderOptions): RenderQueueItem[] => {
        options.template = "Apple ProRes 4444 XQ with alpha";
        return this.addToQueue(options);
    };

    private getTemplateExtension = (templateName: string): string => {
        if (KT_String.contains(templateName, "H.264", false)) {
            return ".mp4";
        } else if (
            KT_String.contains(templateName, "QuickTime", false) ||
            KT_String.contains(templateName, "ProRes", false)
        ) {
            return ".mov";
        } else if (KT_String.contains(templateName, "AVI", false)) {
            return ".avi";
        }
        return ".mov";
    };
}

const KT_ProjectRender = new __KT_ProjectRender();
export { KT_ProjectRender };
