/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 18:59:27
 * @Description: 左侧文件资源管理器view模块
 */

import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { IEditorService } from './EditorPart'
import { Part } from './Part'

export class SideBarPart implements ISideBarService, Part {

    private _container!: HTMLElement

    constructor(
        //TODO 两个part同时注入同一个Service会报错
        //  @IEditorService private readonly editorService: IEditorService
    ) {

    }

    create(container: HTMLElement): void {
        this._container = container

    }

}

export interface ISideBarService { }

export const ISideBarService = createDecorator<ISideBarService>("ISideBarService")
registerSingleton(ISideBarService, SideBarPart)