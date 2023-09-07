/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-07 19:25:44
 * @Description: 左侧文件资源管理器view模块
 */
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { ITextFileService } from '../services/TextFileService'
import { IFileTabPart } from './FileTab'
import { IEditorPart } from './Editor'
import { TreeListView } from '../dom/treeView'
import { Part } from './Part'
import type { TreeNode } from '../dom/treeView'
export class SideBarPart implements ISideBarPart, Part {

    private _container!: HTMLElement

    constructor(
        @IFileTabPart private readonly fileTabPart: IFileTabPart,
        @IEditorPart private readonly editorPart: IEditorPart,
        @ITextFileService private readonly textFileService: ITextFileService,
    ) {

    }
    // 创建SideBar本体
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

    // 渲染单个文件
    async event_loadFileContent(e: MouseEvent, node: TreeNode) {
        console.log("--fileInfo--", node);

        const isDir = node.origin?.isDir
        if (isDir) return

        // 通过文件node获取modal
        const absolutePath = node.origin?.absolutePath
        const model = await this.textFileService.getFileModel(absolutePath)

        // 渲染文件Model
        this.editorPart.loadFileModel(model)

        // 添加到tab栏中
        this.fileTabPart.addTabItem(model.id)
    }
}





export interface ISideBarPart {
    renderFileList(fileTree: any): void
}

export const ISideBarPart = createDecorator<ISideBarPart>("ISideBarPart")
registerSingleton(ISideBarPart, SideBarPart)