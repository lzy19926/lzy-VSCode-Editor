/*
 * @Author: Luzy
 * @Date: 2023-08-21 18:09:25
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-03 17:46:58
 * @Description: 运行于浏览器端的编辑器主模块
 */
import { IEditorService } from './parts/Editor'
import { ISideBarService } from './parts/SideBar'
import { ITitleBarService } from './parts/TitleBar'
import { ITerminalPart } from './parts/Terminal'
import { IFileTabPart } from './parts/FileTab'
import { IBroswerEventsService } from './services/BroswerEventsService'
import { SyncDescriptor, getGlobalCollection } from '../common/IOC/serviceCollection';
import { InstantiationService } from '../common/IOC/InstantiationService';


export const enum Parts {
    TITLEBAR_PART = 'workbench.parts.titlebar',
    SIDEBAR_PART = 'workbench.parts.sidebar',
    EDITOR_PART = 'workbench.parts.editor',
    TERMINAL_PART = 'workbench.parts.terminal',
    FILETAB_PART = 'workbench.parts.filetab',
}


export class Workbench {

    private parts: Map<string, any> = new Map()

    constructor(
        // PARTS
        @IEditorService editorService: IEditorService,
        @ITitleBarService titleBarService: ITitleBarService,
        @ISideBarService sideBarService: ISideBarService,
        @ITerminalPart terminalPart: ITerminalPart,
        @IFileTabPart fileTabPart: IFileTabPart,
        // SERVICES
        @IBroswerEventsService broswerEventsService: IBroswerEventsService,
    ) {
        this.parts.set(Parts.EDITOR_PART, editorService)
        this.parts.set(Parts.SIDEBAR_PART, sideBarService)
        this.parts.set(Parts.TITLEBAR_PART, titleBarService)
        this.parts.set(Parts.TERMINAL_PART, terminalPart)
        this.parts.set(Parts.FILETAB_PART, fileTabPart)
    }

    open() {
        this.createParts()
    }

    createParts() {
        const needParts = [
            { id: Parts.EDITOR_PART, classList: ["editor"] },
            { id: Parts.SIDEBAR_PART, classList: ["sideBar"] },
            { id: Parts.TITLEBAR_PART, classList: ["titleBar"] },
            { id: Parts.TERMINAL_PART, classList: ["terminal_part"] },
            { id: Parts.FILETAB_PART, classList: ["filetab_part"] },
        ]

        for (const { id, classList } of needParts) {
            const partContainer = this.createPartContainer(id, classList);
            this.parts.get(id).create(partContainer);
        }
    }

    createPartContainer(id: string, classList: string[]): HTMLElement {
        const container = document.createElement('div');
        container.id = id

        container.classList.add(...classList)
        document.body.appendChild(container)
        return container
    }
}


// 创建运行workbench
function main() {
    const services = getGlobalCollection()
    const WorkbenchDesc = new SyncDescriptor(Workbench)

    const instantiationService = new InstantiationService(services)
    const workbench = instantiationService.createInstance(WorkbenchDesc)

    workbench.open()
}

main()