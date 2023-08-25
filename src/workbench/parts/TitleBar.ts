/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-25 15:00:02
 * @Description: 顶部导航菜单栏
 */
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { IEditorService } from './EditorPart'
import { ISideBarService } from './SideBar'
import { Part } from './Part'
import API from '../api'

export class TitleBarPart implements ITitleBarService, Part {
    private _container!: HTMLElement

    constructor(
        @IEditorService private readonly editorService: IEditorService,
        @ISideBarService private readonly sideBarService: ISideBarService
    ) {

    }

    create(container: HTMLElement): void {
        this._container = container

        this.createOpenDirBtn()
        this.createOpenFileBtn()
   
    }

    // 打开文件夹按钮
    createOpenDirBtn() {
        const btn = document.createElement("button")
        btn.innerText = "打开文件夹"
        btn.onclick = this.event_loadFiletreeFromDir
        this._container.appendChild(btn)
    }

    // 打开文件按钮
    createOpenFileBtn() {
        const btn = document.createElement("input")
        btn.innerText = "打开文件"
        btn.type = "file"
        btn.onchange = this.event_loadFileContent.bind(this)
        this._container.appendChild(btn)
    }

    // 按钮事件 获取并加载文件树
    async event_loadFiletreeFromDir(event: Event) {
        const res = await API.getFileTreeFromDir()
        const fileTree = res.data
        this.sideBarService.renderFileList(fileTree)
    }

    // 按钮事件 加载单个文件
    event_loadFileContent(event: Event) {
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