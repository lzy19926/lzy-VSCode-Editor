/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 11:51:40
 * @Description: 
 */

import { createDecorator } from '../IOC/decorator'
import { registerSingleton } from '../IOC/serviceCollection'

export class PerformanceService { }

export interface IPerformanceService { }

export const IPerformanceService = createDecorator<IPerformanceService>("IPerformanceService")
registerSingleton(IPerformanceService, PerformanceService)