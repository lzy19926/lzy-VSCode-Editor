/*
 * @Author: Luzy
 * @Date: 2023-08-21 18:09:25
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 14:05:50
 * @Description: 
 */
import { IEditorService } from './parts/EditorPart'
import { ISideBarService } from './parts/SideBar'
import { ITitleBarService } from './parts/TitleBar'

export const enum Parts {
    TITLEBAR_PART = 'workbench.parts.titlebar',
    SIDEBAR_PART = 'workbench.parts.sidebar',
    EDITOR_PART = 'workbench.parts.editor',
}



export class Workbench {

    private parts: Map<string, any> = new Map()

    constructor(
        @IEditorService editorService: IEditorService,
        @ISideBarService sideBarService: ISideBarService,
        @ITitleBarService titleBarService: ITitleBarService,
    ) {

        this.parts.set(Parts.EDITOR_PART, editorService)
        this.parts.set(Parts.SIDEBAR_PART, sideBarService)
        this.parts.set(Parts.TITLEBAR_PART, titleBarService)
    }

    open() {
        this.createParts()
    }

    createParts() {
        const needParts = [
            { id: Parts.EDITOR_PART },
            { id: Parts.SIDEBAR_PART },
            { id: Parts.TITLEBAR_PART },
        ]

        for (const { id } of needParts) {
            const partContainer = this.createPartContainer(id);
            this.parts.get(id).create(partContainer);
        }
    }

    createPartContainer(id: string): HTMLElement {

        const container = document.createElement('div');
        container.id = id

        return container
    }
}
