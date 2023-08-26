/*
 * @Author: Luzy
 * @Date: 2023-08-26 16:33:18
 * @LastEditors: Luzy
 * @LastEditTime: 2023-08-26 16:33:42
 * @Description: 用于在打开窗口的preload中 注入相关API到沙箱理
 */


import { ipcRenderer, contextBridge } from "electron"


declare global {
    interface Window {
        IPC: Electron.IpcRenderer;
    }
}

// 给UI沙箱环境注入所需属性
export function injectPropsInWorkbenchSandbox() {
    // 注入IPC Renderer
    contextBridge.exposeInMainWorld("IPC", ipcRenderer)
    console.log('Inject ipcRenderer SUCCESS');
}


injectPropsInWorkbenchSandbox()