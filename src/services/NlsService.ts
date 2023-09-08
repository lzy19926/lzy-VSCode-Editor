/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 11:51:18
 * @Description: 
 */

import { createDecorator } from '../common/IOC/decorator'
import { registerSingleton } from '../common/IOC/serviceCollection'

export class NlsService { }

export interface INlsService { }

export const INlsService = createDecorator<INlsService>("INlsService")
registerSingleton(INlsService, NlsService)