/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 18:35:32
 * @Description: 左侧文件资源管理器view模块
 */

import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { IEditorService } from './EditorPart'
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

}

export interface ISideBarService { }

export const ISideBarService = createDecorator<ISideBarService>("ISideBarService")
registerSingleton(ISideBarService, SideBarPart)