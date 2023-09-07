/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-07 20:17:22
 * @Description: 顶部导航菜单栏
 */
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { IIPCRendererService } from '../services/IPCRendererService'
import { ICommandService } from '../command/CommandService'
import { ISideBarPart } from './SideBar'
import { Part } from './Part'

export class TitleBarPart implements ITitleBarPart, Part {
    private _container!: HTMLElement

    constructor(
        @ISideBarPart private readonly sideBarPart: ISideBarPart,
        @ICommandService private readonly commandService: ICommandService,
        @IIPCRendererService private readonly ipcRendererService: IIPCRendererService,
    ) { }

    // 创建
    create(container: HTMLElement): void {
        this._container = container
        this.createOpenDirBtn()
        this.createOpenFileBtn()
    }

    // 打开文件夹按钮
    createOpenDirBtn() {
        const btn = document.createElement("button")
        btn.innerText = "打开文件夹"
        btn.onclick = (e: Event) => {
            this.commandService.executeCommand("workbench.action.pickFolderAndOpen")
        }
        this._container.appendChild(btn)
    }

    // 打开文件按钮
    createOpenFileBtn() {
        const btn = document.createElement("button")
        btn.innerText = "打开文件"
        btn.onclick = this.event_loadFileContent.bind(this)
        this._container.appendChild(btn)
    }

    //todo 需要重写 按钮事件 加载单个文件
    async event_loadFileContent(event: Event) {
        alert("此功能暂不开放")

        // /**@ts-ignore*/
        // const file = event.target?.files?.[0]
        // const editor = this.editorService

        // if (file) {
        //     const reader = new FileReader();
        //     reader.onload = () => {
        //         const text = reader.result;
        //         if (typeof text == 'string') {
        //             // editor.loadFileContent(text)
        //         }
        //     };
        //     reader.readAsText(file);
        // }
    }
}

export interface ITitleBarPart { }

export const ITitleBarPart = createDecorator<ITitleBarPart>("ITitleBarPart")
registerSingleton(ITitleBarPart, TitleBarPart)