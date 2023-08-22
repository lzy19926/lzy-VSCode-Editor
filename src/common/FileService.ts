/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-22 11:50:49
 * @Description: 
 */

import { createDecorator } from './IOC/decorator'
import { registerSingleton } from './IOC/serviceCollection'

export class FileService { }

export interface IFileService { }

export const IFileService = createDecorator<IFileService>("IFileService")
registerSingleton(IFileService, FileService)