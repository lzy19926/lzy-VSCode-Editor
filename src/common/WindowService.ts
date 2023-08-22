/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 11:52:00
 * @Description: 
 */

import { createDecorator } from './IOC/decorator'
import { registerSingleton } from './IOC/serviceCollection'

export class WindowService { }

export interface IWindowService { }

export const IWindowService = createDecorator<IWindowService>("IWindowService")
registerSingleton(IWindowService, WindowService)