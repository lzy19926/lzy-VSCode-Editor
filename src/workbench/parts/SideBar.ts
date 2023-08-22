/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 12:57:01
 * @Description: 
 */

import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { Part } from './Part'

export class SideBarPart implements ISideBarService, Part {
    create(container: HTMLElement): void {

    }
}

export interface ISideBarService { }

export const ISideBarService = createDecorator<ISideBarService>("ISideBarService")
registerSingleton(ISideBarService, SideBarPart)