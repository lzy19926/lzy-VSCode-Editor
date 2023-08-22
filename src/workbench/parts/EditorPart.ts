/*
 * @Author: Luzy
 * @Date: 2023-08-22 10:31:12
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 12:57:35
 * @Description: 
 */
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { Part } from './Part'

//! 这里part同时作为EditorService  即提供服务也提供Dom结构
export class EditorPart implements IEditorService, Part {

    constructor() {
        // this._editor = undefined
    }


    create(container: HTMLElement) {
        console.log(container);
    }


    loadMonaco() {

    }
}

export interface IEditorService {

}

export const IEditorService = createDecorator<IEditorService>("IEditorService")
registerSingleton(IEditorService, EditorPart)