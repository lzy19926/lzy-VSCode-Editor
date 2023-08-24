/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-24 16:30:18
 * @Description: 顶部导航菜单栏
 */

import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { IEditorService } from './EditorPart'
import { Part } from './Part'


export class TitleBarPart implements ITitleBarService, Part {
    private _container!: HTMLElement

    constructor(
        @IEditorService private readonly editorService: IEditorService
    ) {

    }

    create(container: HTMLElement): void {

        this._container = container

        this.createOpenFileBtn()
        this.createOpenDirBtn()
        this.saveFileBtn()
    }



    // 保存文件按钮
    saveFileBtn() {
        const editor = this.editorService
        const btn = document.createElement("button")
        btn.innerText = "保存文件测试"
        this._container.appendChild(btn)
    }


    // 打开文件夹按钮
    createOpenDirBtn() {
        const btn = document.createElement("input")
        btn.innerText = "打开文件夹测试"
        btn.onclick = () => {
          
        }
        this._container.appendChild(btn)
    }
    // 打开文件按钮
    createOpenFileBtn() {
        const btn = document.createElement("input")
        btn.innerText = "打开文件测试"
        btn.type = "file"
        btn.onchange = this.readFileTest.bind(this)
        this._container.appendChild(btn)
    }

    // 加载文件测试
    readFileTest(event: Event) {
        /**@ts-ignore*/
        const file = event.target?.files?.[0]
        const editor = this.editorService

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const text = reader.result;
                if (typeof text == 'string') {
                    editor.loadFileContent(text)
                }
            };
            reader.readAsText(file);
        }
    }
}

export interface ITitleBarService { }

export const ITitleBarService = createDecorator<ITitleBarService>("ITitleBarService")
registerSingleton(ITitleBarService, TitleBarPart)