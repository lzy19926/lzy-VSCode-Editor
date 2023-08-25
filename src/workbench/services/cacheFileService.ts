/*
 * @Author: Luzy
 * @Date: 2023-08-25 16:56:06
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-25 17:21:32
 * @Description: 提供文本文件前端缓存功能
 */

import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import type { TextFileModel } from './textFileService'

export class CacheFileService {

    _cache: Map<string, TextFileModel> = new Map()

    get(id: string) {
        return this._cache.get(id)
    }

    set(id: string, model: TextFileModel) {
        this._cache.set(id, model)
    }

}

export interface ICacheFileService {
    get(id: string): TextFileModel | undefined
    set(id: string, model: TextFileModel): void
}

export const ICacheFileService = createDecorator<ICacheFileService>("ICacheFileService")
registerSingleton(ICacheFileService, CacheFileService)