/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 17:49:22
 * @Description: 顶部导航菜单栏
 */
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { IEditorService } from './Editor'
import { ISideBarService } from './SideBar'
import { IIPCRendererService } from '../services/IPCRendererService'
import { Part } from './Part'

export class TitleBarPart implements ITitleBarService, Part {
    private _container!: HTMLElement

    constructor(
        @IEditorService private readonly editorService: IEditorService,
        @ISideBarService private readonly sideBarService: ISideBarService,
        @IIPCRendererService private readonly ipcRendererService: IIPCRendererService,

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
        btn.onclick = this.event_loadFiletreeFromDir.bind(this)
        this._container.appendChild(btn)
    }

    // 打开文件按钮
    createOpenFileBtn() {
        const btn = document.createElement("button")
        btn.innerText = "打开文件"
        btn.onclick = this.event_loadFileContent.bind(this)
        this._container.appendChild(btn)
    }

    // 按钮事件 获取并加载文件树
    async event_loadFiletreeFromDir(event: Event) {
        const res = await this.ipcRendererService.invokeAPI("getFileTreeFromDir")
        const fileTree = res
        this.sideBarService.renderFileList(fileTree)
    }

    //todo 需要重写 按钮事件 加载单个文件
    async event_loadFileContent(event: Event) {
        alert("此功能暂不开放")
    }
}

export interface ITitleBarService { }

export const ITitleBarService = createDecorator<ITitleBarService>("ITitleBarService")
registerSingleton(ITitleBarService, TitleBarPart)