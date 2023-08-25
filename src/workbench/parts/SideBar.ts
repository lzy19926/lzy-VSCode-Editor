/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-25 14:55:58
 * @Description: 左侧文件资源管理器view模块
 */

import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { IEditorService } from './EditorPart'
import { TreeListView } from '../dom/treeView'
import { Part } from './Part'
import API from '../api'
export class SideBarPart implements ISideBarService, Part {

    private _container!: HTMLElement

    constructor(
        @IEditorService private readonly editorService: IEditorService
    ) {

    }

    create(container: HTMLElement): void {
        this._container = container
    }

    // 渲染文件列表 给列表节点指定事件
    public renderFileList(fileTree: any) {
        let tree = new TreeListView([fileTree]);

        tree.bindEvents([
            { eventName: "click", callback: this.event_loadFileContent.bind(this) }
        ])

        tree.render(this._container)
    }

    //ul事件 渲染单个文件
    async event_loadFileContent(e: MouseEvent, node: any) {
        console.log(node);
        
        const isDir = node.origin?.isDir
        if (isDir) return

        const fileAbsolutePath = node.origin?.absolutePath

        const res = await API.getFileContent(fileAbsolutePath)

        // 解析后端传来的buffer
        const binaryArray = res.data.data;
        const buffer = new Uint8Array(binaryArray)
        const fileContentString = new TextDecoder().decode(buffer);

        this.editorService.loadFileContent(fileContentString)
    }
}





export interface ISideBarService {
    renderFileList(fileTree: any): void
}

export const ISideBarService = createDecorator<ISideBarService>("ISideBarService")
registerSingleton(ISideBarService, SideBarPart)