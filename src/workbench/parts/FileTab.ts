/*
 * @Author: Luzy
 * @Date: 2023-09-03 17:37:07
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-07 11:47:26
 * @Description: 用于展示文件的tab栏
 */

import { registerSingleton } from '../../common/IOC/serviceCollection'
import { createDecorator } from '../../common/IOC/decorator'
import { ITextFileService } from '../services/TextFileService'
import { IEditorService } from './Editor'
import { TabView } from '../dom/tabView'
import { Part } from './Part'

export class FileTabPart implements IFileTabPart, Part {

    _tab!: TabView
    fileList: string[] = []
    fileSet: Set<string> = new Set()

    private _container!: HTMLElement

    constructor(
        @IEditorService private readonly editorService: IEditorService,
        @ITextFileService private readonly textFileService: ITextFileService,
    ) { }

    // 创建
    public create(container: HTMLElement) {
        this._container = container
        this.renderFileTabs()
    }

    // 添加tabItem,并给返回的dom添加加载文件事件
    addTabItem(path: string) {
        if (this._tab && !this.fileSet.has(path)) {

            this._tab.addFile(path)

            this._tab.bindEvents(path, {
                onClick: (e: Event) => {
                    e.stopPropagation()
                    this.loadFileContent.call(this, path)
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

    // 加载单个文件
    async loadFileContent(path: string) {
        const isCurrentModel = this.editorService.getCurrentModel()?.id == path
        if (isCurrentModel) return

        const model = await this.textFileService.getFileModel(path)
        this.editorService.loadFileModel(model)
        this._tab.focus(path)
    }

    // 移除单个文件
    async removeFile(path: string) {

        const isCurrentModel = this.editorService.getCurrentModel()?.id == path

        if (isCurrentModel) {
            this._loadPrevFile(path)
        }

        this._removeFile(path)
    }

    _removeFile(path: string) {
        this.textFileService.removeFileModel(path)
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
            this.editorService.clearContent()
            return
        }

        const prevFilePath = this.fileList[prevFileIdx]

        if (prevFilePath) {
            this.loadFileContent(prevFilePath)
        }
    }
}

export interface IFileTabPart {
    addTabItem(id: string): void
    removeTabItem(path: string): void
}

export const IFileTabPart = createDecorator<IFileTabPart>("IFileTabPart")
registerSingleton(IFileTabPart, FileTabPart)
