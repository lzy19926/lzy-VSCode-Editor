/*
 * @Author: Luzy
 * @Date: 2023-08-25 16:56:06
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-07 00:08:39
 * @Description: 提供文本文件前端缓存功能
 */

import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import type { TextFileModel } from './TextFileService'

export class CacheFileService {

    _cache: Map<string, TextFileModel> = new Map()

    get(id: string) {
        return this._cache.get(id)
    }

    set(id: string, model: TextFileModel) {
        this._cache.set(id, model)
    }

    has(id: string) {
        return this._cache.has(id)
    }

    remove(id: string) {
        return this._cache.delete(id)
    }

    update(id: string, text: string) {
        const model = this._cache.get(id)

        if (model) {
            model.text = text
            console.log(`Update File:[[${id}]] in Cache Succeed`);
        }

    }
}

export interface ICacheFileService {
    get(id: string): TextFileModel | undefined
    set(id: string, model: TextFileModel): void
    has(id: string): boolean
    remove(id: string): boolean
    update(id: string, text: string): void
}

export const ICacheFileService = createDecorator<ICacheFileService>("ICacheFileService")
registerSingleton(ICacheFileService, CacheFileService)