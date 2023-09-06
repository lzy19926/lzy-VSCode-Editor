/*
 * @Author: Luzy
 * @Date: 2023-09-03 17:37:07
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-06 23:54:07
 * @Description: 用于展示文件的tab栏
 */

import { registerSingleton } from '../../common/IOC/serviceCollection'
import { createDecorator } from '../../common/IOC/decorator'
import { ICacheFileService } from '../services/CacheFileService'
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
        @ICacheFileService private readonly cacheFileService: ICacheFileService,
        @ITextFileService private readonly textFileService: ITextFileService,
    ) { }

    // 创建
    public create(container: HTMLElement) {
        this._container = container
        this.renderFileTabs()
    }

    // 添加文件,并给返回的dom添加加载文件事件
    addFile(path: string) {
        if (this._tab && !this.fileSet.has(path)) {

            const tabItem = this._tab.addFile(path)

            const wrappedEvent = (e: Event) => {
                this.event_loadFileContent.call(this, e, path)
            }

            tabItem.addEventListener('click', wrappedEvent)
        }

        this.fileSet.add(path)
    }

    // 渲染文件tabs
    renderFileTabs() {
        const tab = new TabView(this.fileList)
        tab.render(this._container)
        this._tab = tab
    }

    // 节点事件,加载单个文件
    async event_loadFileContent(e: Event, path: string) {

        const model = await this.textFileService.getFileModel(path)

        this.editorService.loadFileModel(model)

        this._tab.focus(path)
    }
}

export interface IFileTabPart {
    addFile(id: string): void
}

export const IFileTabPart = createDecorator<IFileTabPart>("IFileTabPart")
registerSingleton(IFileTabPart, FileTabPart)
