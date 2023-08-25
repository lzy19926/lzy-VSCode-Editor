/*
 * @Author: Luzy
 * @Date: 2023-08-25 16:42:55
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-25 17:51:28
 * @Description: 提供前端文本对象相关功能
 */

import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { ICacheFileService } from './cacheFileService'
import { IEditorService } from '../parts/Editor'

// 单个文本文件对象
export type TextFileModel = {
    id: string
    buffer: Uint8Array
    text: string
}

// 创建文件对象
export function createFileModel(path: string, buffer: Buffer): TextFileModel {
    const binaryArray = new Uint8Array(buffer)
    const fileContentString = new TextDecoder().decode(binaryArray);

    return {
        id: path,
        buffer: binaryArray,
        text: fileContentString
    }
}


export class TextFileService {

    readonly _currentModel?: TextFileModel //当前编辑器中的文件对象

    constructor(
        @ICacheFileService private readonly cacheFileService: ICacheFileService,
        @IEditorService private readonly editorService: IEditorService,
    ) {

    }


    // 比较编辑器文本和原文件内容
    // todo 使用ArrayBuffer进行逐行比较  否则字符串过大会崩溃
    diffText_test(id: string) {

        const originFile = this.cacheFileService.get(id)
        // const currentModel = this.editorService.getCurrentFileModel()
    }



}

export interface ITextFileService { }

export const ITextFileService = createDecorator<ITextFileService>("ITextFileService")
registerSingleton(ITextFileService, TextFileService)