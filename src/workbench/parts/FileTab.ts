/*
 * @Author: Luzy
 * @Date: 2023-09-03 17:37:07
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-07 20:12:32
 * @Description: 用于展示文件的tab栏
 */

import { registerSingleton } from '../../common/IOC/serviceCollection'
import { createDecorator } from '../../common/IOC/decorator'
import { IEditorModelService } from '../services/EditorModelService'
import { ICommandService } from '../command/CommandService'
import { IEditorPart } from './Editor'
import { TabView } from '../dom/tabView'
import { Part } from './Part'

export class FileTabPart implements IFileTabPart, Part {

    _tab!: TabView
    fileList: string[] = []
    fileSet: Set<string> = new Set()

    private _container!: HTMLElement

    constructor(
        @IEditorPart private readonly editorPart: IEditorPart,
        @ICommandService private readonly commandService: ICommandService,
        @IEditorModelService private readonly editorModelService: IEditorModelService,
    ) { }

    // 创建
    public create(container: HTMLElement) {
        this._container = container
        this.renderFileTabs()
    }

    // 添加tabItem,并给返回的dom添加加载文件事件
    addOrFocuseTabItem(path: string) {
        if (this._tab && !this.fileSet.has(path)) {

            this._tab.addFile(path)

            this._tab.bindEvents(path, {
                onClick: (e: Event) => {
                    e.stopPropagation()
                    this.commandService.executeCommand("workbench.action.loadFileContent", path)
                },
                onClose: (e: Event) => {
                    e.stopPropagation()
                    this.removeFile.call(this, path)
                }
            })

            this.fileList.push(path)
        }

        this.fileSet.add(path)
        this._tab.focus(path)
    }

    // 移除
    removeTabItem(path: string) {
        this.fileSet.delete(path)
        this._tab.removeItem(path)
    }
 
    // 渲染文件tabs
    renderFileTabs() {
        const tab = new TabView()
        tab.render(this._container)
        this._tab = tab
    }

    // 移除单个文件
    async removeFile(path: string) {

        const isCurrentModel = this.editorPart.getCurrentModel()?.id == path

        if (isCurrentModel) {
            this._loadPrevFile(path)
        }

        this._removeFile(path)
    }

    _removeFile(path: string) {
        this.editorModelService.removeFileModel(path)
        this.removeTabItem(path)

        this.fileList = this.fileList.filter(item => item !== path)
    }

    _loadPrevFile(path: string) {
        const removedIdx = this.fileList.indexOf(path)

        let prevFileIdx
        if (removedIdx == this.fileList.length - 1) {
            prevFileIdx = removedIdx - 1
        } else {
            prevFileIdx = removedIdx + 1
        }

        if (prevFileIdx == -1) {
            this.editorPart.clearContent()
            return
        }

        const prevFilePath = this.fileList[prevFileIdx]

        if (prevFilePath) {
            this.commandService.executeCommand("workbench.action.loadFileContent", prevFilePath)
        }
    }

    focus(path: string) {
        this._tab.focus(path)
    }
}

export interface IFileTabPart {
    focus(path: string): void
    addOrFocuseTabItem(id: string): void
    removeTabItem(path: string): void
}

export const IFileTabPart = createDecorator<IFileTabPart>("IFileTabPart")
registerSingleton(IFileTabPart, FileTabPart)
