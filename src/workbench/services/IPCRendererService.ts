
/*
 * @Author: Luzy
 * @Date: 2023-08-22 11:36:46
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 17:44:53
 * @Description: 运行在渲染进程中的IPC通信模块 负责与主进程通信
 */
import { createDecorator } from '../../common/IOC/decorator'
import { registerSingleton } from '../../common/IOC/serviceCollection'

export class IPCRendererService {

    IPC: Electron.IpcRenderer

    constructor() {
        this.IPC = window.IPC
    }
    // 此API类似于网络请求的fetch
    // https://www.electronjs.org/zh/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    public invokeAPI(api: string, params?: any) {
        return this.IPC.invoke("API", { api, params })
    }
}

export interface IIPCRendererService {
    invokeAPI(api: string, params?: any): Promise<any>
}

export const IIPCRendererService = createDecorator<IIPCRendererService>("IIPCRendererService")
registerSingleton(IIPCRendererService, IPCRendererService)