/*
 * @Author: Luzy
 * @Date: 2023-09-03 17:37:07
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-04 21:37:36
 * @Description: 用于展示文件的tab栏
 */

import { Part } from './Part'
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { ITextFileService } from '../services/TextFileService'
import { ICacheFileService } from '../services/CacheFileService'
import { TabView } from '../dom/tabView'
import { getFileName } from '../utils'

export class FileTabPart implements IFileTabPart, Part {

    _tab?: TabView
    fileList: string[] = []
    fileSet: Set<string> = new Set()

    private _container!: HTMLElement


    constructor(
        @ICacheFileService private readonly cacheFileService: ICacheFileService,
        @ITextFileService private readonly textFileService: ITextFileService,
    ) { }

    // 创建
    public create(container: HTMLElement) {
        this._container = container
        this.renderFileTabs()
    }

    // 更新容器样式
    private updateStyle() {
        this._container.style.height = "95%"
    }

    // 添加文件
    addFile(path: string) {
        debugger
        if (this._tab && !this.fileSet.has(path)) {
            const fileName = getFileName(path)
            this._tab.addFile(fileName)
        }

        this.fileSet.add(path)
    }

    // 渲染文件tabs
    renderFileTabs() {
        const tab = new TabView(this.fileList)
        tab.render(this._container)
        this._tab = tab
    }
}

export interface IFileTabPart {
    addFile(id: string): void
}

export const IFileTabPart = createDecorator<IFileTabPart>("IFileTabPart")
registerSingleton(IFileTabPart, FileTabPart)
