/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-04 21:11:20
 * @Description: 左侧文件资源管理器view模块
 */
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { IIPCRendererService } from '../services/IPCRendererService'
import { ITextFileService } from '../services/TextFileService'
import { IFileTabPart } from './FileTab'
import { IEditorService } from './Editor'
import { TreeListView } from '../dom/treeView'
import { Part } from './Part'

export class SideBarPart implements ISideBarService, Part {

    private _container!: HTMLElement

    constructor(
        @IFileTabPart private readonly fileTabPart: IFileTabPart,
        @IEditorService private readonly editorService: IEditorService,
        @ITextFileService private readonly textFileService: ITextFileService,
        @IIPCRendererService private readonly ipcRendererService: IIPCRendererService,
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
    async event_loadFileContent(e: MouseEvent, node: any) {
        console.log("--fileInfo--", node);

        const isDir = node.origin?.isDir
        if (isDir) return

        // todo 使用缓存
        const fileAbsolutePath = node.origin?.absolutePath
        const fileText = await this.ipcRendererService.invokeAPI("readFileTextSync", { path: fileAbsolutePath })
        const model = this.textFileService.getFileModel(fileAbsolutePath, fileText)

        // 渲染文件Model
        this.editorService.loadFileModel(model)

        // 添加到tab栏中
        this.fileTabPart.addFile(model.id)
    }
}





export interface ISideBarService {
    renderFileList(fileTree: any): void
}

export const ISideBarService = createDecorator<ISideBarService>("ISideBarService")
registerSingleton(ISideBarService, SideBarPart)