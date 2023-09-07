/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-09-07 11:50:25
 * @Description: 集成终端UI部分
 */
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'
import { IIPCRendererService } from '../services/IPCRendererService'
import { AttachAddon } from "xterm-addon-attach";
import { FitAddon } from 'xterm-addon-fit'
import { Terminal } from 'xterm';
import { Part } from './Part'


export class TerminalPart implements ITerminalPart, Part {
    private _container!: HTMLElement
    private _term!: Terminal

    constructor(
        @IIPCRendererService private readonly ipcRendererService: IIPCRendererService,
    ) {

    }
    // 创建
    create(container: HTMLElement): void {
        this._container = container
        this.createTerminal()
        this.connectWebsocket()
        this.autoResize()
    }

    // 创建xterm终端UI
    createTerminal() {

        var term = new Terminal({
            rows: 10,
            convertEol: false, //启用时，光标将设置为下一行的开头
            disableStdin: false, //是否应禁用输入。
            cursorBlink: true, //光标闪烁
            fontSize: 12,
            theme: {
                foreground: 'white', //字体
                background: 'black', //背景色
                cursor: 'help',//设置光标
            }
        });

        term.open(this._container);
        term.writeln('LzyEditor Terminal opened with Windows PowerShell')
        term.writeln('PS C:\\Users\\Lzy19926>')

        this._term = term
    }

    // 将前端xtermUI链接到ws服务器-与启动的node-pty绑定
    // 通过xterm自带的AttachAddon插件自动实现与ws的交互
    async connectWebsocket() {
        // 获取Terminal的WS服务端口
        const wsPort = await this.ipcRendererService.invokeAPI("createTerminal")

        const socketURL = `ws://127.0.0.1:${wsPort}`
        const ws = new WebSocket(socketURL);

        // 启动ws交互插件
        const attachAddon = new AttachAddon(ws);
        this._term.loadAddon(attachAddon);

        console.log("xterm ready");
    }

    // 使用插件提供终端自动响应式布局功能
    autoResize() {
        const fitAddon = new FitAddon()
        this._term.loadAddon(fitAddon);

        window.addEventListener('resize', () => setTimeout(() => {
            fitAddon.fit()
        }, 100));
    }
}





export interface ITerminalPart { }

export const ITerminalPart = createDecorator<ITerminalPart>("ITerminalPart")
registerSingleton(ITerminalPart, TerminalPart)