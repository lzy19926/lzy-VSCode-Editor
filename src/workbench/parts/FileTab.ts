/*
 * @Author: Luzy
 * @Date: 2023-09-03 17:37:07
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-03 17:45:29
 * @Description: 用于展示文件的tab栏
 */

import { Part } from './Part'
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'

export class FileTabPart implements IFileTabPart, Part {

    private _container!: HTMLElement

    constructor() { }

    // 创建
    public create(container: HTMLElement) {
        this._container = container
    }

    // 更新容器样式
    private updateStyle() {
        this._container.style.height = "95%"
    }
}

export interface IFileTabPart {

}

export const IFileTabPart = createDecorator<IFileTabPart>("IEditorService")
registerSingleton(IFileTabPart, FileTabPart)
