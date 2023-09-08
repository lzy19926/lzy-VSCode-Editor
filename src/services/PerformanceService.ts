/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-08 11:06:43
 * @Description: 
 */

import { createDecorator } from '../common/IOC/decorator'
import { registerSingleton } from '../common/IOC/serviceCollection'

export class PerformanceService { }

export interface IPerformanceService { }

export const IPerformanceService = createDecorator<IPerformanceService>("IPerformanceService")
registerSingleton(IPerformanceService, PerformanceService)