/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-08 11:07:22
 * @Description: 
 */

import { createDecorator } from '../common/IOC/decorator'
import { registerSingleton } from '../common/IOC/serviceCollection'

export class WindowService { }

export interface IWindowService { }

export const IWindowService = createDecorator<IWindowService>("IWindowService")
registerSingleton(IWindowService, WindowService)