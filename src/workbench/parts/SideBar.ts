/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-07 20:09:35
 * @Description: 左侧文件资源管理器view模块
 */
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { ICommandService } from '../command/CommandService'
import { TreeListView } from '../dom/treeView'
import { Part } from './Part'
import type { TreeNode } from '../dom/treeView'
export class SideBarPart implements ISideBarPart, Part {

    private _container!: HTMLElement

    constructor(
        @ICommandService private readonly commandService: ICommandService,
    ) {

    }
    // 创建SideBar本体
    create(container: HTMLElement): void {
        this._container = container
    }

    // 渲染文件列表 给列表节点指定事件
    public renderFileList(fileTree: any) {
        let tree = new TreeListView([fileTree]);

        const wrappedEvent = (e: MouseEvent, node: TreeNode) => {
            console.log("--fileInfo--", node);

            const isDir = node.origin?.isDir
            if (isDir) return

            const absolutePath = node.origin?.absolutePath

            this.commandService.executeCommand("workbench.action.loadFileContent", absolutePath)
        }

        tree.bindEvents([
            { eventName: "click", callback: wrappedEvent.bind(this) }
        ])

        tree.render(this._container)
    }
}

export interface ISideBarPart {
    renderFileList(fileTree: any): void
}

export const ISideBarPart = createDecorator<ISideBarPart>("ISideBarPart")
registerSingleton(ISideBarPart, SideBarPart)