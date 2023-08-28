/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-28 12:25:33
 * @Description: 提供terminal相关服务
 * 1. 接收前端xterm输入信息,并转到node-pty中执行
 */

import { createDecorator } from './IOC/decorator'
import { registerSingleton } from './IOC/serviceCollection'
import { checkPort } from './utils'
import * as os from 'os'
import * as pty from 'node-pty'
import WebSocket from 'ws';

export class TerminalService {

    private term?: pty.IPty
    private ws_port: number = 9000 // 终端链接用ws开启端口

    constructor() {
      
    }

    //todo 启动一个终端(可改进为支持多个终端  使用pid标记)
    public async start(): Promise<number> {
        const freePort = await this.getFreePort()

        if (freePort == -1) {
            console.warn("Start Terminal Failed")
        } else {
            this.createTerminal()
            this.startWebsocketServer(freePort)
            this.ws_port = freePort
        }

        return this.ws_port
    }

    // 顺延三次获取可用端口
    async getFreePort(): Promise<number> {
        let retry = 0
        let port = this.ws_port

        const fn = async () => {
            const isPortFree = await checkPort(port)

            if (retry <= 3 && !isPortFree) {
                retry++
                port++
                await fn()
            } else if (retry > 3) {
                console.warn("Could not find an available port. Retried 3 times")
                port = -1
            }
        }

        await fn()

        return port
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
    startWebsocketServer(port: number) {
        const wss = new WebSocket.Server({ port });
        const term = this.term as pty.IPty

        wss.on('connection', function connection(ws) {
            console.log('[Terminal Server] A client Connected.');

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