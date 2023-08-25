/*
 * @Author: Luzy
 * @Date: 2023-08-25 16:42:55
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-25 23:13:39
 * @Description: 提供前端文本模型相关功能
 */

import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { ICacheFileService } from './cacheFileService'
import { IEditorService } from '../parts/Editor'

// 单个文本文件模型
export type TextFileModel = {
    id: string
    buffer: Uint8Array
    text: string
}


export class TextFileService {
    readonly _currentModel?: TextFileModel //当前编辑器中的文件模型

    constructor(
        @ICacheFileService private readonly cacheFileService: ICacheFileService,
        @IEditorService private readonly editorService: IEditorService,
    ) {
        this.onSaveFile()
    }
    // 比较编辑器文本和原文件内容
    // todo 需要优化为使用ArrayBuffer进行逐行比较  否则字符串过大会崩溃
    // todo 可使用下列库进行操作
    // JsDiff：一个用于Web浏览器和Node.js 的JavaScript差异算法。它支持字符、标记以及行对比。
    // fast-jsdiff：JsDiff改进，并加入了Babylon diff补丁支持。

    diffText_test() {
        const currentText = this.editorService.getCurrentText()
        const originModel = this.editorService.getCurrentModel()


        if (originModel) {
            const id = originModel.id

            if (originModel.text !== currentText) {
                console.log(`File:[[${id}]]  Changed`);
                this.cacheFileService.update(id, currentText)
            } else {
                console.log(`File:[[${id}]]  NO Changed`);
            }
        }


    }

    // 获取文件模型
    public getFileModel(path: string, buffer: Buffer): TextFileModel {
        let model = this.cacheFileService.get(path)

        if (!model) {
            model = this._createFileModel(path, buffer)
            this.cacheFileService.set(path, model)
        }

        return model
    }

    // 创建文件模型
    private _createFileModel(path: string, buffer: Buffer) {
        const binaryArray = new Uint8Array(buffer)
        const fileContentString = new TextDecoder().decode(binaryArray);

        return {
            id: path,
            buffer: binaryArray,
            text: fileContentString
        }
    }






    //!-------------------监听ctrl+s键盘事件--------------------
    //todo 使用mousetrap库进行改写
    onSaveFile() {

        const that = this

        document.addEventListener('keydown', function (event) {
            // 按下 Ctrl 和 s 键
            if (event.ctrlKey && event.keyCode === 83) {
                // 防止浏览器默认行为 
                event.preventDefault();
                console.log('Ctrl+S was pressed');

                that.diffText_test()
            }
        });
    }

}

export interface ITextFileService {
    getFileModel(path: string, buffer: Buffer): TextFileModel
}

export const ITextFileService = createDecorator<ITextFileService>("ITextFileService")
registerSingleton(ITextFileService, TextFileService)






