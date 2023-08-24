/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-25 00:53:34
 * @Description: 左侧文件资源管理器view模块
 */

import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { IEditorService } from './EditorPart'
import { TreeListView } from '../dom/treeView'
import { Part } from './Part'

export class SideBarPart implements ISideBarService, Part {

    private _container!: HTMLElement

    constructor(
        @IEditorService private readonly editorService: IEditorService
    ) {

    }

    create(container: HTMLElement): void {
        this._container = container
    }

    // 渲染文件列表
    public renderFileList(fileTree: any) {
        // 创建 TreeList 实例并渲染到指定元素中。
        let tree = new TreeListView([fileTree], this._container);
    }

    // 渲染单个文件
    public renderFileContent() {
        fetch('lzy://api/getFileContent')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.editorService.loadFileContent("11")
            })
    }
}

export interface ISideBarService {
    renderFileList(fileTree: any): void
}

export const ISideBarService = createDecorator<ISideBarService>("ISideBarService")
registerSingleton(ISideBarService, SideBarPart)