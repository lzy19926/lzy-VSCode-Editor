/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-28 11:32:04
 * @Description: 提供terminal相关服务
 * 1. 接收前端xterm输入信息,并转到node-pty中执行
 */

import { createDecorator } from './IOC/decorator'
import { registerSingleton } from './IOC/serviceCollection'
import * as os from 'os'
import * as pty from 'node-pty'
import WebSocket from 'ws';

export class TerminalService {

    private term?: pty.IPty

    constructor() {
        this.start()
    }

    //todo 启动一个终端(可改进为支持多个终端  使用pid标记)
    public start() {
        this.createTerminal()
        this.startWebsocketServer()
    }

    // 创建一个新的伪终端进程并将其附加到当前会话中
    createTerminal() {
        const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
        const term = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME,
            env: process.env,
        });

        this.term = term
    }

    // 启动ws长连接-port:9999,与前端xtrem进行交互
    startWebsocketServer() {
        const wss = new WebSocket.Server({ port: 9999 });
        const term = this.term as pty.IPty

        wss.on('connection', function connection(ws) {
            console.log('[Server] A client Connected.');

            term.onData(data => {
                ws.send(data.trim());
            });

            // 当收到来自客户端消息时处理函数.
            ws.on('message', message => {
                const content = message.toString('utf-8')
                console.log('[Terminal Server Received]: %s', content);
                term.write(content);
            });

            ws.on("close", function () {
                term.kill();
            });

        });

    }

}

export interface ITerminalService {
    start(): void
}

export const ITerminalService = createDecorator<ITerminalService>("ITerminalService")
registerSingleton(ITerminalService, TerminalService)