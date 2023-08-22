/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 12:57:17
 * @Description: 
 */

import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { Part } from './Part'


export class TitleBarPart implements ITitleBarService, Part {
    create(container: HTMLElement): void {

    }
}

export interface ITitleBarService { }

export const ITitleBarService = createDecorator<ITitleBarService>("ITitleBarService")
registerSingleton(ITitleBarService, TitleBarPart)