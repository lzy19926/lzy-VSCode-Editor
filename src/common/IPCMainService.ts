/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 16:13:26
 * @Description: 运行在主进程中的IPC通信模块  用于接收子进程的服务请求  或者转发子进程消息给其他子进程
 */

import { createDecorator } from './IOC/decorator'
import { registerSingleton } from './IOC/serviceCollection'
import { ipcMain } from 'electron'

export class IPCMainService {


    constructor() {
        this.listen()
    }

    listen() {
        this.listenAPI()
        this.listenProxy()
    }

    // 处理API调用请求
    listenAPI() {
        ipcMain.on('API', (event, arg) => {
            console.log('receve message', arg)
        })
    }

    // 处理需要转发到其他子进程消息
    listenProxy() {
        ipcMain.on('Proxy', (event, arg) => {
            console.log('receve message', arg)
        })
    }

}

export interface IIPCMainService { }

export const IIPCMainService = createDecorator<IIPCMainService>("IIPCMainService")
registerSingleton(IIPCMainService, IPCMainService)