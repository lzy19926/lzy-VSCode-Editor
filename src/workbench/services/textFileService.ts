/*
 * @Author: Luzy
 * @Date: 2023-08-25 16:42:55
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-06 23:30:32
 * @Description: 提供前端文本模型相关功能, 前端文本先修改后再修改后端文本
 */

import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { ICacheFileService } from './CacheFileService'
import { IEditorService } from '../parts/Editor'
import { IIPCRendererService } from './IPCRendererService'
import type { TreeNode } from '../dom/treeView'
// 单个文本文件模型
export type TextFileModel = {
    id: string
    text: string
    buffer: Uint8Array | undefined
}


export class TextFileService {
    readonly _currentModel?: TextFileModel //当前编辑器中的文件模型

    constructor(
        @ICacheFileService private readonly cacheFileService: ICacheFileService,
        @IEditorService private readonly editorService: IEditorService,
        @IIPCRendererService private readonly ipcRendererService: IIPCRendererService,
    ) {

    }
    // 比较编辑器文本和原文件内容
    // todo 需要优化为使用ArrayBuffer进行逐行比较  否则字符串过大会崩溃
    // todo 可使用下列库进行操作
    // JsDiff：一个用于Web浏览器和Node.js 的JavaScript差异算法。它支持字符、标记以及行对比。
    // fast-jsdiff：JsDiff改进，并加入了Babylon diff补丁支持。
    diffCurrentFileModel() {
        const currentText = this.editorService.getCurrentText()
        const originModel = this.editorService.getCurrentModel()
        if (originModel) {
            const id = originModel.id

            if (originModel.text !== currentText) {
                console.log(`File:[[${id}]]  Changed`);

                this.updateDiskFile(id, currentText)
                this.cacheFileService.update(id, currentText)
            } else {
                console.log(`File:[[${id}]]  NO Changed`);
            }
        }
    }

    // 获取文件模型
    public async getFileModel(path: string): Promise<TextFileModel> {

        let model = this.cacheFileService.get(path)

        // 无缓存时  发请求获取文件数据
        if (!model) {
            const bufferOrText: Buffer | string = await this.ipcRendererService.invokeAPI("readFileTextSync", { path })
            model = this._createFileModel(path, bufferOrText)
            this.cacheFileService.set(path, model)
        }

        return model
    }

    // 创建文件模型(创建文件的Uint8Array和text)
    private _createFileModel(id: string, bufferOrText: Buffer | string): TextFileModel {
        let text, buffer

        if (typeof bufferOrText == 'string') {
            text = bufferOrText
        } else {
            buffer = new Uint8Array(bufferOrText)
            text = new TextDecoder().decode(buffer);
        }

        return { id, text, buffer }
    }

    // 通知文件进程写回文件内容到硬盘
    private updateDiskFile(path: string, content: string) {
        this.ipcRendererService.invokeAPI("writeFileTextSync", { path, text: content })
        console.log(`Update File:[[${path}]] in Disk Succeed`);
    }

}

export interface ITextFileService {
    diffCurrentFileModel(): void
    getFileModel(path: string): Promise<TextFileModel>
}

export const ITextFileService = createDecorator<ITextFileService>("ITextFileService")
registerSingleton(ITextFileService, TextFileService)






